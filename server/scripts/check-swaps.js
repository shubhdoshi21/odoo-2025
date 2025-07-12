const mongoose = require('mongoose');
const Swap = require('../models/Swap');
require('dotenv').config();

async function checkSwaps() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all swaps
    const swaps = await Swap.find()
      .populate('requester', 'name email')
      .populate('responder', 'name email')
      .populate('offeredSkill', 'name')
      .populate('requestedSkill', 'name');

    console.log(`\nTotal swaps in database: ${swaps.length}`);

    if (swaps.length > 0) {
      console.log('\nAll swaps:');
      swaps.forEach((swap, index) => {
        console.log(`\n${index + 1}. Swap ID: ${swap._id}`);
        console.log(`   Status: ${swap.status}`);
        console.log(
          `   Requester: ${
            swap.requester?.name || swap.requester?.email || 'Unknown'
          }`,
        );
        console.log(
          `   Responder: ${
            swap.responder?.name || swap.responder?.email || 'Unknown'
          }`,
        );
        console.log(
          `   Offered Skill: ${swap.offeredSkill?.name || 'Unknown'}`,
        );
        console.log(
          `   Requested Skill: ${swap.requestedSkill?.name || 'Unknown'}`,
        );
        console.log(`   Created: ${swap.createdAt}`);
        if (swap.acceptedAt) console.log(`   Accepted: ${swap.acceptedAt}`);
        if (swap.completedAt) console.log(`   Completed: ${swap.completedAt}`);
        if (swap.rejectedAt) console.log(`   Rejected: ${swap.rejectedAt}`);
        if (swap.cancelledAt) console.log(`   Cancelled: ${swap.cancelledAt}`);
      });
    }

    // Check for pending and accepted swaps
    const pendingSwaps = swaps.filter(swap => swap.status === 'pending');
    const acceptedSwaps = swaps.filter(swap => swap.status === 'accepted');
    const completedSwaps = swaps.filter(swap => swap.status === 'completed');

    console.log(`\nStatus breakdown:`);
    console.log(`- Pending: ${pendingSwaps.length}`);
    console.log(`- Accepted: ${acceptedSwaps.length}`);
    console.log(`- Completed: ${completedSwaps.length}`);

    // Check for swaps between specific users (if you know the user IDs)
    if (process.argv[2] && process.argv[3]) {
      const user1Id = process.argv[2];
      const user2Id = process.argv[3];

      console.log(`\nChecking swaps between users ${user1Id} and ${user2Id}:`);

      const swapsBetweenUsers = swaps.filter(
        swap =>
          (swap.requester._id.toString() === user1Id &&
            swap.responder._id.toString() === user2Id) ||
          (swap.requester._id.toString() === user2Id &&
            swap.responder._id.toString() === user1Id),
      );

      if (swapsBetweenUsers.length > 0) {
        swapsBetweenUsers.forEach(swap => {
          console.log(`- Swap ID: ${swap._id}, Status: ${swap.status}`);
        });
      } else {
        console.log('No swaps found between these users');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkSwaps();
