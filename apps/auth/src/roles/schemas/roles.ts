export const defaultRoles = [
  {
    name: 'admin',
    permissions: ['manage_users', 'view_reports', 'edit_settings'],
  },
  {
    name: 'user',
    permissions: ['view_content', 'comment'],
  },
  {
    name: 'guest',
    permissions: ['view_content'],
  },
];
