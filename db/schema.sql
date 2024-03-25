CREATE TABLE data_users
(
	user_id           varchar(64)                 default (uuid())   not null primary key,
	first_name        varchar(32)                                    not null,
	last_name         varchar(32)                                    not null,
	password          varchar(64)                                    not null,
	email_address     varchar(64) unique                             not null,
	phone_number      varchar(32)                                    null,
	status            enum ('active', 'inactive') default ('active') not null,
	is_first_login    boolean                     default true,
	last_logged_in_at timestamp                   default null       null,
	created_at        timestamp                   default current_timestamp,
	updated_at        timestamp                   default current_timestamp on update current_timestamp
);

INSERT INTO data_users (first_name, last_name, password, email_address, phone_number, status, is_first_login,
												last_logged_in_at)
VALUES ('John', 'Doe', 'password', 'doejo@gmail.com', '1234567890', 'active', true, null);
