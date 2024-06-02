import { ImapFlow, MailboxObject } from "imapflow"

const client = new ImapFlow({
  host: "localhost",
  port: 143, // 993 secure true
  secure: false,
  auth: {
    user: "example@mail.mg", // email de l'utilisateur
    pass: "default", // mot de passe de l'email de l'utilisateur
  }
})

const main = async () => {
  // Wait until client connects and authorizes
  await client.connect()

  // Select and lock a mailbox. Throws if mailbox does not exist
  let lock = await client.getMailboxLock("INBOX")
  try {
    // fetch latest message source
    // client.mailbox includes information about currently selected mailbox
    // "exists" value is also the largest sequence number available in the mailbox
    const mailbox = client.mailbox as MailboxObject
    let message = await client.fetchOne(mailbox.exists.toString(), { source: true })
    console.log(message.source.toString());

    // list subjects for all messages
    // uid value is always included in FETCH response, envelope strings are in unicode
    for await (let message of client.fetch('1:*', { envelope: true })) {
      console.log(`${message.uid}: ${message.envelope.subject}`);
    }
  } finally {
    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release()
  }

  // log out and close connection
  await client.logout()
}

main().catch(err => console.log(err))
