/**
  id integer [pk]
  role_id varchar(2) [ref: > roles.type]
  username varchar [not null, unique]
  password varchar [not null]
  disabled boolean
  first_name varchar
  last_name varchar
  document_id varchar(2) [ref: > document_types.type]
  document varchar
  last_login timestamp
  created_at timestamp
  updated_at timestamp
  created_by integer
  updated_by integer
 */
export class User {
  id?: string;
  roleId?: string;
  username?: string;
  password?: string;
  disabled?: boolean;
  firstName?: string;
  lastName?: string;
  documentId?: string;
  document?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
