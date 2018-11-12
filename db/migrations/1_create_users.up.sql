SET timezone = 'America/Los_Angeles';
CREATE TABLE userinfo
    (
        id serial primary key,
        name character varying(100) NOT NULL,
        email character varying(100) NOT NULL,
        phone character varying(100) NOT NULL,
        position character varying(100) NOT NULL,
        languages character varying(100) NOT NULL,
        referrer character varying(100) NOT NULL,
        resume character varying(100) NOT NULL,
        education character varying(100) NOT NULL,
        major character varying(100) NOT NULL,
        about character varying(500) NOT NULL,
        skills character varying(500) NOT NULL,
        ref1 character varying(100) NOT NULL,
        ref2 character varying(100) NOT NULL,
        ref3 character varying(100) NOT NULL,
        admin boolean default false,
        created timestamp not null default CURRENT_TIMESTAMP
    )
    WITH (OIDS=FALSE);