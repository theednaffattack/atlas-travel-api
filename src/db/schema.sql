SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--
COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--
COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
--
-- Name: like_liketype_enum; Type: TYPE; Schema: public; Owner: -
--
CREATE TYPE public.like_liketype_enum AS ENUM ('hotel', 'activity', 'review');
SET default_tablespace = '';
SET default_with_oids = false;
--
-- Name: comment; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.comment (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
  "likeType" character varying NOT NULL,
  "userId" uuid
);
--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.event_entity (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  name text NOT NULL,
  start_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  end_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "venueId" uuid NOT NULL,
  "organizerId" uuid NOT NULL,
  price integer NOT NULL
);
--
-- Name: hotel; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.hotel (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  amenities text,
  "loveCount" integer DEFAULT 0 NOT NULL,
  "commentCount" integer,
  "zipCodeSuffix" integer,
  coordinates public.geography(Point, 4326),
  geom public.geometry,
  price integer NOT NULL,
  name text NOT NULL,
  address text,
  suite text,
  city text,
  state text,
  "zipCode" text
);
--
-- Name: hotel_like; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.hotel_like (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
  "hotelId" uuid,
  "userId" uuid
);
--
-- Name: image; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.image (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  uri character varying NOT NULL,
  "userId" uuid,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
--
-- Name: like; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public."like" (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
  "userId" uuid,
  "likeType" public.like_liketype_enum NOT NULL
);
--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.message (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
  message character varying NOT NULL,
  "sentBy" character varying,
  "userId" uuid
);
--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.migrations (
  id integer NOT NULL,
  "timestamp" bigint NOT NULL,
  name character varying NOT NULL
);
--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
CREATE SEQUENCE public.migrations_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--
ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
--
-- Name: photo; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.photo (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  uri character varying NOT NULL,
  name character varying NOT NULL,
  description character varying,
  "isPublished" boolean DEFAULT false,
  "hotelId" uuid,
  "venueId" uuid
);
--
-- Name: photo_metadata; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.photo_metadata (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  height integer NOT NULL,
  width integer NOT NULL,
  orientation character varying NOT NULL,
  compressed boolean NOT NULL,
  comment character varying NOT NULL
);
--
-- Name: reservation; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.reservation (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "from" timestamp without time zone NOT NULL,
  "to" timestamp without time zone NOT NULL,
  "userId" uuid,
  "roomId" uuid,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
--
-- Name: review; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.review (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  value numeric(2, 1) NOT NULL,
  title character varying NOT NULL,
  text character varying NOT NULL,
  "userId" uuid,
  "hotelId" uuid,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
  "venueId" uuid
);
--
-- Name: room; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.room (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "roomNumber" character varying NOT NULL,
  type character varying NOT NULL,
  beds integer NOT NULL,
  "maxOccupancy" integer NOT NULL,
  "costPerNight" integer NOT NULL,
  "hotelId" uuid
);
--
-- Name: saved; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.saved (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "userId" uuid
);
--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.schema_migrations (version character varying(255) NOT NULL);
-- --
-- -- Name: test; Type: TABLE; Schema: public; Owner: -
-- --
-- CREATE TABLE public.test (
--     id uuid,
--     name character varying(255),
--     email character varying(255) NOT NULL
-- );
--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public."user" (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "firstName" character varying NOT NULL,
  "lastName" character varying NOT NULL,
  email text NOT NULL,
  "profileImageUri" text,
  password character varying NOT NULL,
  confirmed boolean DEFAULT false NOT NULL,
  "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
--
-- Name: user_followers_user; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.user_followers_user (
  "userId_1" uuid NOT NULL,
  "userId_2" uuid NOT NULL
);
--
-- Name: venue; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.venue (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  name text NOT NULL,
  amenities text,
  "loveCount" integer DEFAULT 0 NOT NULL,
  "commentCount" integer,
  address text,
  suite text,
  city text,
  state text,
  "zipCode" text,
  "zipCodeSuffix" integer,
  coordinates public.geography(Point, 4326),
  type text
);
--
-- Name: venue_seating; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.venue_seating (
  id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
  "roomNumber" character varying NOT NULL,
  type character varying NOT NULL,
  beds integer NOT NULL,
  "maxOccupancy" integer NOT NULL,
  "costPerNight" integer NOT NULL,
  "venueId" uuid
);
--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.migrations
ALTER COLUMN id
SET DEFAULT nextval('public.migrations_id_seq'::regclass);
--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.comment
ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);
--
-- Name: review PK_2e4299a343a81574217255c00ca; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.review
ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);
--
-- Name: hotel PK_3a62ac86b369b36c1a297e9ab26; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.hotel
ADD CONSTRAINT "PK_3a62ac86b369b36c1a297e9ab26" PRIMARY KEY (id);
--
-- Name: reservation PK_48b1f9922368359ab88e8bfa525; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.reservation
ADD CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY (id);
--
-- Name: venue_seating PK_55505a971de114cd6033177566d; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.venue_seating
ADD CONSTRAINT "PK_55505a971de114cd6033177566d" PRIMARY KEY (id);
--
-- Name: photo PK_723fa50bf70dcfd06fb5a44d4ff; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.photo
ADD CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY (id);
--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.migrations
ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
--
-- Name: user_followers_user PK_980ff03f415077df184596dcf73; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.user_followers_user
ADD CONSTRAINT "PK_980ff03f415077df184596dcf73" PRIMARY KEY ("userId_1", "userId_2");
--
-- Name: hotel_like PK_9f6bcd0719db9c751dcddc9c9ed; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.hotel_like
ADD CONSTRAINT "PK_9f6bcd0719db9c751dcddc9c9ed" PRIMARY KEY (id);
--
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.message
ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);
--
-- Name: venue PK_c53deb6d1bcb088f9d459e7dbc0; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.venue
ADD CONSTRAINT "PK_c53deb6d1bcb088f9d459e7dbc0" PRIMARY KEY (id);
--
-- Name: event_entity PK_c5675e66b601bd4d0882054a430; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.event_entity
ADD CONSTRAINT "PK_c5675e66b601bd4d0882054a430" PRIMARY KEY (id);
--
-- Name: room PK_c6d46db005d623e691b2fbcba23; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.room
ADD CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY (id);
--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public."user"
ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);
--
-- Name: saved PK_cb4672121c11ed3824acc8d0985; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.saved
ADD CONSTRAINT "PK_cb4672121c11ed3824acc8d0985" PRIMARY KEY (id);
--
-- Name: image PK_d6db1ab4ee9ad9dbe86c64e4cc3; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.image
ADD CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY (id);
--
-- Name: photo_metadata PK_da29f04585dc190eb00e4d73420; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.photo_metadata
ADD CONSTRAINT "PK_da29f04585dc190eb00e4d73420" PRIMARY KEY (id);
--
-- Name: like PK_eff3e46d24d416b52a7e0ae4159; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public."like"
ADD CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY (id);
--
-- Name: user UQ_3d328f5ff477a6bd7994cdbe823; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public."user"
ADD CONSTRAINT "UQ_3d328f5ff477a6bd7994cdbe823" UNIQUE ("profileImageUri");
--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public."user"
ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);
--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.schema_migrations
ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
--
-- Name: IDX_110f993e5e9213a7a44f172b26; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX "IDX_110f993e5e9213a7a44f172b26" ON public.user_followers_user USING btree ("userId_2");
--
-- Name: IDX_26312a1e34901011fc6f63545e; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX "IDX_26312a1e34901011fc6f63545e" ON public.user_followers_user USING btree ("userId_1");
--
-- Name: IDX_5992021704d1f0c0c8b53d864d; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX "IDX_5992021704d1f0c0c8b53d864d" ON public.hotel USING gist (coordinates);
--
-- Name: IDX_7019e20b4a9877a9d1ca3ca57d; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX "IDX_7019e20b4a9877a9d1ca3ca57d" ON public.venue USING gist (coordinates);
--
-- Name: IDX_c5f710bd79548d56a0518782c4; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX "IDX_c5f710bd79548d56a0518782c4" ON public.hotel USING gist (geom);
--
-- Name: user_followers_user FK_110f993e5e9213a7a44f172b264; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.user_followers_user
ADD CONSTRAINT "FK_110f993e5e9213a7a44f172b264" FOREIGN KEY ("userId_2") REFERENCES public."user"(id) ON DELETE CASCADE;
--
-- Name: review FK_1337f93918c70837d3cea105d39; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.review
ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: review FK_21a6e42d6748767b7898d7f403c; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.review
ADD CONSTRAINT "FK_21a6e42d6748767b7898d7f403c" FOREIGN KEY ("venueId") REFERENCES public.venue(id);
--
-- Name: user_followers_user FK_26312a1e34901011fc6f63545e2; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.user_followers_user
ADD CONSTRAINT "FK_26312a1e34901011fc6f63545e2" FOREIGN KEY ("userId_1") REFERENCES public."user"(id) ON DELETE CASCADE;
--
-- Name: photo FK_2d87fc3c550c8acbc9c232963ec; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.photo
ADD CONSTRAINT "FK_2d87fc3c550c8acbc9c232963ec" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);
--
-- Name: room FK_2fac52abaa01b54156539cad11c; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.room
ADD CONSTRAINT "FK_2fac52abaa01b54156539cad11c" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);
--
-- Name: hotel_like FK_31f123ebae82bbe96036e5dd849; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.hotel_like
ADD CONSTRAINT "FK_31f123ebae82bbe96036e5dd849" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);
--
-- Name: event_entity FK_37c0bff49005f1825f7a59cea8b; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.event_entity
ADD CONSTRAINT "FK_37c0bff49005f1825f7a59cea8b" FOREIGN KEY ("venueId") REFERENCES public.venue(id);
--
-- Name: message FK_446251f8ceb2132af01b68eb593; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.message
ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: event_entity FK_49b8d28975e3bdacf93f5aad1f9; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.event_entity
ADD CONSTRAINT "FK_49b8d28975e3bdacf93f5aad1f9" FOREIGN KEY ("organizerId") REFERENCES public."user"(id);
--
-- Name: photo FK_4f991220b327c78efa0ea116221; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.photo
ADD CONSTRAINT "FK_4f991220b327c78efa0ea116221" FOREIGN KEY ("venueId") REFERENCES public.venue(id);
--
-- Name: reservation FK_529dceb01ef681127fef04d755d; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.reservation
ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: review FK_86bed2411a875eb84306554f946; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.review
ADD CONSTRAINT "FK_86bed2411a875eb84306554f946" FOREIGN KEY ("hotelId") REFERENCES public.hotel(id);
--
-- Name: saved FK_920dd054f0294f7a36ba136151f; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.saved
ADD CONSTRAINT "FK_920dd054f0294f7a36ba136151f" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: venue_seating FK_b69595f622a6cab8a1f62c70153; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.venue_seating
ADD CONSTRAINT "FK_b69595f622a6cab8a1f62c70153" FOREIGN KEY ("venueId") REFERENCES public.venue(id);
--
-- Name: comment FK_c0354a9a009d3bb45a08655ce3b; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.comment
ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: image FK_dc40417dfa0c7fbd70b8eb880cc; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.image
ADD CONSTRAINT "FK_dc40417dfa0c7fbd70b8eb880cc" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: hotel_like FK_dcec1605a3fc44263eded174ae5; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.hotel_like
ADD CONSTRAINT "FK_dcec1605a3fc44263eded174ae5" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: like FK_e8fb739f08d47955a39850fac23; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public."like"
ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES public."user"(id);
--
-- Name: reservation FK_ee6959f2cbe32d030b5e58b45d7; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.reservation
ADD CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7" FOREIGN KEY ("roomId") REFERENCES public.room(id);
--
-- PostgreSQL database dump complete
--
--
-- Dbmate schema migrations
--
INSERT INTO public.schema_migrations (version)
VALUES ('20200808001418');