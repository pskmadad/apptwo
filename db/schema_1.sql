mysql --user=root mysql --password=*****

create database grocery;
use grocery;
select database();

create user 'groceryapp'@'%' identified by 'Gr0c@ry';
GRANT SELECT,INSERT,UPDATE,DELETE ON grocery.* TO 'groceryapp'@'%';
show grants for 'groceryapp'@'%';

create user 'groceryadmin'@'%' identified by 'Gr0c@ry';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON grocery.* TO 'groceryadmin'@'%';
show grants for 'groceryadmin'@'%';

mysql -h localhost -u groceryadmin grocery -p
mysql -h localhost -u groceryapp grocery -p

show tables;

/************************************************************************************************************ 
*                                           IMPORTANT NOTE                                                  *
*                   Server set up-> my.ini->under mysqldsql-mode="STRICT_ALL_TABLES"                        *
*************************************************************************************************************/
create table m_consumers(
    id int not null auto_increment primary key,
    primary_mobile_no varchar(15), /* primary mobile number */
    alt_mobile_no varchar(15), /* Alternate mobile number */
    email varchar(150), /* Email address, either mobile or email is required */
    verified char(1) not null, /* flag to tell whether user verified their identity */
    gen_pin varchar(10) not null, /* generated pin number sent as SMS */
    status varchar(10) not null, /* Initially PENDING, SENT_EMAIL, SENT_SMS, SENT_BOTH, ATTEMPT_FAIL, SUCCESS */
    attempt_count int not null, /* flag to identity user locked */
    uuid varchar(250) not null, /* unique id of the device */
    overall_save float(15,2) not null, /* savings till today for this user */
    last_redeem date, /* Last time when user redeemed their savings */
    savings_balance float(7,2) not null, /* saving amount */
    last_accessed_channel char(1), /* Last accessed their profile using M-Mobile, W-Web */
    created_channel char(1) not null, /* Mode of creation M-mobile, W-web*/
    created_date datetime not null,
    created_by varchar(100) not null,
    updated_by varchar(100) not null,
    updated_date datetime not null,
    last_logged_in datetime not null) engine = innodb;

create table m_cons_address(
    id bigint not null auto_increment primary key,
    consumer_id int not null, /* address belong to which user */
    name varchar(100), /* May be different person who is going to get the delivery */
    building_name varchar(200), /* apartment name */
    address varchar(500) not null, /* Full address except city & state */
    city varchar(50) not null, /* Name of the city */
    state varchar(10) not null, /* Name of the state */
    pin int not null,  /* pincode */
    latitude decimal(9,6), /* Lattitude of the address */
    longitude decimal(9,6), /* Longitude of the address */
    mobile_no varchar(15), /* Mobile number to reach out the customer, request can be made by one person but delivering to  different person */ 
    used_date datetime not null, /* Date on which this address is used to deliver */
    preferred_address char(1), /* Flag to identity that as preferred address for delivery */
    foreign key(consumer_id) references m_consumers(id)) engine = innodb;

create table m_items(
    id int not null auto_increment primary key, /* primary key of the item table */
    name varchar(250) not null, /* Name of the item */
    brand varchar(50), /* Brand of the item if it has */
    category varchar(50) not null, /* Major category which item belongs to */
    weight varchar(50) not null, /* Eg: 100 gms, 1 kg, 1 lt */
    mrp_price float(7,2) not null, /* price of the item */
    ind char(1) not null, /* Supported or removed, no use as of now, by default is it Y */
    updated_by varchar(150) not null,
    updated_date date not null) engine = innodb;

create table t_orders(
    id bigint not null auto_increment primary key, /* primary key of the item table */
    consumer_id int not null, /* order made by the customer */
    status varchar(15) not null, /* REQUESTED, ACCEPTED, PLACED, READY, DELIVERED */
    cost float(7,2) not null, /* Overall cost for this order */
    del_cost smallint, /* cost of delivery */
    savings smallint, /* savings of the order */
    placed_date datetime not null, /* date of order placed */
    sync_date datetime not null, /* date at which data sync from user device */
    del_date datetime, /* date at which order will be delivered */
    split char(1) not null, /* flag represent split or single order */
    split_order_id bigint, /* If order is splited then it will hold parent order id */
    coupon_code varchar(20), /* What is the discount given to user, it may be 10% or flat 100 Rs or something else */
    redeemption float(7,2), /* When user uses their savings, redeemption amount should be recorded, helpful while giving money to merchant */ 
    foreign key (consumer_id) references m_user(id)) engine = innodb;

create table t_order_items(
    id bigint not null auto_increment primary key,
    order_id bigint not null, /* main or split order id */
    item_id int not null, /* items in the main order or split order */
    avail_mrp float(7,2) not null, /* cost of the item in our database, may be outdated. */
    actual_mrp float(7,2), /* Real MRP value printed on the item. Our system may have invalid price */
    quantity int not null, /* Quantity of the item */
    foreign key(order_id) references t_order(id),
    foreign key(item_id) references m_item(id)) engine = innodb;

create table t_order_address(
    id bigint not null auto_increment primary key,
    consumer_id int not null,
    order_id bigint not null,
    address_id bigint not null,
    free_del char(1) not null, /* Flag to identify free delivery */
    foreign key(consumer_id) references m_user(id),
    foreign key(order_id) references t_order(id),
    foreign key(address_id) references m_address(id)) engine = innodb;


create table m_merchant(
    id int not null auto_increment primary key,
    mobile_no varchar(15) not null, /* Mobile number */
    email varchar(150), /* Email address, either mobile or email is required */
    phone varchar(15),
    onaboarded char(1) not null, /* flag to tell whether user verified their identity */
    preferred_bucket char(1), /* Merchant may be categoried to different buket, indicator to identify their type */
    status varchar(10) not null, /* Initially PENDING, SENT_SMS, ATTEMPT_FAIL, SUCCESS */
    attempt_count int not null, /* flag to identity user locked */
    uuid varchar(250) not null, /* unique id of the device */
    lattitude decimal(9,6), /* Lattitude of the address */
    longitute decimal(9,6), /* Longitude of the address */
    del_range smallint, /* Delivery range, which they can offer eg: 5 km, 3 km */
    del_time varchar(20), /* Preferred timing for delivery MORNING, NOON, EVENING, LATE_EVENING */ 
    created_date date not null,
    created_by varchar(100) not null,
    updated_by varchar(100) not null,
    updated_date date not null,
    last_logged_in date not null) engine = innodb;

   