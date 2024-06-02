"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imapflow_1 = require("imapflow");
const client = new imapflow_1.ImapFlow({
    host: "localhost",
    port: 143,
    secure: false,
    auth: {
        user: "example@mail.mg",
        pass: "default",
    }
});
const main = async () => {
    await client.connect();
    let lock = await client.getMailboxLock("INBOX");
    try {
        const mailbox = client.mailbox;
        let message = await client.fetchOne(mailbox.exists.toString(), { source: true });
        console.log(message.source.toString());
        for await (let message of client.fetch('1:*', { envelope: true })) {
            console.log(`${message.uid}: ${message.envelope.subject}`);
        }
    }
    finally {
        lock.release();
    }
    await client.logout();
};
main().catch(err => console.log(err));
