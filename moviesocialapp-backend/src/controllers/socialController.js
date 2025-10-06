const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class SocialController {
  /**
   * Get all comments for a specific movie
   * GET /api/comments/:tmdbId
   */
  async getMovieComments(req, res) {
    try {
      const { tmdbId } = req.params;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const comments = await db.collection('comments')
        .find({ tmdbId: parseInt(tmdbId) })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(comments);
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  }

  /**
   * Add a new comment to a movie
   * POST /api/comments
   * Body: { tmdbId, content }
   */
  async addComment(req, res) {
    try {
      const { tmdbId, content } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      // ✅ Convert userId to ObjectId for querying
      const userObjectId = userId instanceof ObjectId ? userId : new ObjectId(userId);

      // Get user name
      const user = await db.collection('users').findOne({ _id: userObjectId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = {
        tmdbId: parseInt(tmdbId),
        userId: userObjectId,  // ✅ Store as ObjectId
        userName: user.name,
        content: content.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('comments').insertOne(comment);

      // Return the created comment with _id
      const createdComment = await db.collection('comments').findOne({ _id: result.insertedId });
      res.status(201).json(createdComment);
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Error adding comment' });
    }
  }

  /**
   * Update an existing comment
   * PUT /api/comments/:id
   * Body: { content }
   */
  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid comment ID' });
      }

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Content is required' });
      }

      // ✅ Convert userId to ObjectId for comparison
      const userObjectId = userId instanceof ObjectId ? userId : new ObjectId(userId);

      // Check if comment exists and belongs to user
      const comment = await db.collection('comments').findOne({
        _id: new ObjectId(id),
        userId: userObjectId  // ✅ Compare as ObjectId
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      // Update comment
      await db.collection('comments').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            content: content.trim(),
            updatedAt: new Date()
          }
        }
      );

      res.json({ message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Update comment error:', error);
      res.status(500).json({ message: 'Error updating comment' });
    }
  }

  /**
   * Delete a comment
   * DELETE /api/comments/:id
   */
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid comment ID' });
      }

      // ✅ Convert userId to ObjectId for comparison
      const userObjectId = userId instanceof ObjectId ? userId : new ObjectId(userId);

      // Check if comment exists and belongs to user
      const comment = await db.collection('comments').findOne({
        _id: new ObjectId(id),
        userId: userObjectId  // ✅ Compare as ObjectId
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      // Delete comment
      await db.collection('comments').deleteOne({ _id: new ObjectId(id) });

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ message: 'Error deleting comment' });
    }
  }

  /**
   * Get activity feed (recent comments across all movies)
   * GET /api/feed?page=1&limit=10
   */
  async getFeed(req, res) {
    try {
      const db = getDB();
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get recent comments across all movies
      const feedItems = await db.collection('comments')
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.json({
        items: feedItems,
        page: parseInt(page),
        hasMore: feedItems.length === parseInt(limit)
      });
    } catch (error) {
      console.error('Get feed error:', error);
      res.status(500).json({ message: 'Error fetching feed' });
    }
  }
}

module.exports = new SocialController();