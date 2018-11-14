CREATE TABLE IF NOT EXISTS jobs
    (
        id serial primary key,
        title character varying(100) NOT NULL,
        description character varying(500) NOT NULL,
        expiration timestamp not null default CURRENT_TIMESTAMP,
        applicants integer NOT NULL default 0,
        country character varying(100) NOT NULL,
        languages character varying(100),
        created timestamp not null default CURRENT_TIMESTAMP
    )
    WITH (OIDS=FALSE);

CREATE TABLE IF NOT EXISTS user_job
    (
        user_id integer REFERENCES userinfo(id),
        job_id integer REFERENCES jobs(id)
    );

CREATE UNIQUE INDEX IF NOT EXISTS user_job_index ON user_job (user_id, job_id);