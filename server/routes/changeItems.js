const express = require('express');
const router = express.Router();
const ChangeItem = require('../models/ChangeItem');
const {
  createChangeItemRules,
  updateChangeItemRules,
  generateNotesRules,
  idParamRules,
} = require('../validators/changeItemValidator');

// Type label mapping for release notes
const TYPE_LABELS = {
  feature: '🚀 New Features',
  bugfix: '🐛 Bug Fixes',
  improvement: '✨ Improvements',
  breaking: '💥 Breaking Changes',
  deprecation: '⚠️ Deprecations',
  security: '🔒 Security',
};

// Display order for release notes sections
const TYPE_ORDER = ['breaking', 'security', 'feature', 'improvement', 'bugfix', 'deprecation'];

// ─── GET /api/changes ──────────────────────────────────────────────────────────
// List all change items with optional filters: type, version, status, search
router.get('/', async (req, res, next) => {
  try {
    const { type, version, status, search } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }
    if (version) {
      filter.version = version;
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await ChangeItem.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/changes/versions ──────────────────────────────────────────────────
// Get distinct list of all versions
router.get('/versions', async (req, res, next) => {
  try {
    const versions = await ChangeItem.distinct('version');
    versions.sort((a, b) => {
      const pa = a.split('.').map(Number);
      const pb = b.split('.').map(Number);
      for (let i = 0; i < 3; i++) {
        if (pa[i] !== pb[i]) return pa[i] - pb[i];
      }
      return 0;
    });

    res.json({
      success: true,
      count: versions.length,
      data: versions,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/changes/:id ───────────────────────────────────────────────────────
// Get a single change item by ID
router.get('/:id', idParamRules, async (req, res, next) => {
  try {
    const item = await ChangeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Change item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/changes ──────────────────────────────────────────────────────────
// Create a new change item
router.post('/', createChangeItemRules, async (req, res, next) => {
  try {
    const { title, description, type, version, status, author, tags } = req.body;

    const item = await ChangeItem.create({
      title,
      description,
      type,
      version,
      status,
      author,
      tags,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/changes/:id ───────────────────────────────────────────────────────
// Update a change item
router.put('/:id', updateChangeItemRules, async (req, res, next) => {
  try {
    const item = await ChangeItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Change item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/changes/:id ────────────────────────────────────────────────────
// Delete a change item
router.delete('/:id', idParamRules, async (req, res, next) => {
  try {
    const item = await ChangeItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Change item not found',
      });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/changes/generate-notes ───────────────────────────────────────────
// Generate formatted release notes from selected change items
router.post('/generate-notes', generateNotesRules, async (req, res, next) => {
  try {
    const { version, ids } = req.body;

    // Fetch all requested change items
    const items = await ChangeItem.find({ _id: { $in: ids } });

    // Check that all IDs were found
    if (items.length !== ids.length) {
      const foundIds = items.map((i) => i._id.toString());
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      return res.status(404).json({
        success: false,
        error: 'Some change items were not found',
        missingIds,
      });
    }

    // Verify all items are "completed" or "released"
    const invalidItems = items.filter(
      (item) => item.status !== 'completed' && item.status !== 'released'
    );
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'All selected items must have status "completed" or "released"',
        invalidItems: invalidItems.map((i) => ({
          id: i._id,
          title: i.title,
          status: i.status,
        })),
      });
    }

    // Group items by type
    const grouped = {};
    for (const item of items) {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push({
        id: item._id,
        title: item.title,
        description: item.description,
        author: item.author,
        tags: item.tags,
      });
    }

    // Build sections in defined order, only for types that have items
    const sections = [];
    for (const type of TYPE_ORDER) {
      if (grouped[type] && grouped[type].length > 0) {
        sections.push({
          type,
          label: TYPE_LABELS[type],
          items: grouped[type],
        });
      }
    }

    // Build markdown content
    let markdown = `# Release Notes v${version}\n\n`;
    markdown += `> Generated on ${new Date().toISOString()}\n\n`;

    for (const section of sections) {
      markdown += `## ${section.label}\n\n`;
      for (const item of section.items) {
        const desc = item.description ? `: ${item.description}` : '';
        markdown += `- **${item.title}**${desc}\n`;
      }
      markdown += '\n';
    }

    // Mark all selected items as "released"
    await ChangeItem.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'released' } }
    );

    res.json({
      success: true,
      data: {
        version,
        generatedAt: new Date().toISOString(),
        sections,
        markdownContent: markdown.trim(),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
