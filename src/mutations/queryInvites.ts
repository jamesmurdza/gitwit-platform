import { Ctx } from 'blitz';
import db from 'db';

export default async function queryInvites({ username }, ctx) {
  if (username) {
    const user = await db.invite.findFirst({ where: { username } });
    if (user) {
      return true;
    }
  }
  return false;
}
