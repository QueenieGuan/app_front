/**
 * Command Type list
 * the command is used to send message from parent to children
 */
class CommandType {
  /* transfer view */
  static TRANSFER_VIEW = 'transfer_view';
  /* change city */
  static CHANGE_CITY = 'change_city';
  /* show toast */
  static TOAST = 'toast';
  /* show notify */
  static NOTIFY = 'notify';
};

export default CommandType;
