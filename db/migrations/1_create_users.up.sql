CREATE TABLE IF NOT EXISTS userinfo
    (
        id serial primary key,
        name character varying(100) NOT NULL,
        email character varying(100) UNIQUE,
        phone character varying(100) NOT NULL,
        position character varying(100) NOT NULL,
        languages character varying(100) NOT NULL,
        referrer character varying(100) NOT NULL,
        filename character varying(100) NOT NULL,
        resume character varying(5000) NOT NULL,
        education character varying(100) NOT NULL,
        major character varying(100) NOT NULL,
        reference character varying(100) NOT NULL,
        admin boolean default false,
        created timestamp not null default CURRENT_TIMESTAMP
    )
    WITH (OIDS=FALSE);
