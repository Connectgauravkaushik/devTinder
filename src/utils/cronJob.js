const cron = require('node-cron');
const ConnectionRequest = require('../models/connectionRequests');
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require('./sendEmail');


cron.schedule('50 10 13 * * *', async () => {
    // Send Emails to all people who got requests the previous day

    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday); // give me 12:00am
        const yesterdayEnd = endOfDay(yesterday) // yesterday ending time stamp 11:59pm
        const pendingRequests = await ConnectionRequest.find({
            status: 'interested',
            createdAt: {
                $gte: yesterdayStart, // greater than 
                $lt: yesterdayEnd,  // less than 
            },
        }).populate('fromUserId toUserId');

        // only get toUserId whom i'm sending request
        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];
        console.log(listOfEmails);
        for (const email of listOfEmails) {
            // send Emails
            try {
                const res = await sendEmail.run(" New Freind Request Pending " + email + " please login to accept the request");
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }

    } catch (error) {
        console.error(error)
    }
});