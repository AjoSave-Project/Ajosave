const Group = require('../models/Groups');

/**
 * Turn Guard Middleware
 *
 * Prevents a user from submitting a contribution when it is not their turn.
 * Expects req.body.groupId and req.user._id to be set.
 */
const turnGuard = async (req, res, next) => {
  try {
    const { groupId } = req.body;
    const userId = req.user._id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'groupId is required',
        timestamp: new Date().toISOString()
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
        timestamp: new Date().toISOString()
      });
    }

    const member = group.membersList.find(
      m => m.userId.toString() === userId.toString()
    );

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group',
        timestamp: new Date().toISOString()
      });
    }

    // TODO: Re-enable turn restriction after testing
    if (member.status !== 'current') {
      const currentMember = group.membersList.find(m => m.status === 'current');
      const currentName = currentMember ? currentMember.name : 'another member';
      return res.status(403).json({
        success: false,
        message: `It is not your turn. It is currently ${currentName}'s turn.`,
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = turnGuard;
