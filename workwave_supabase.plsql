--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: offre_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.offre_status_enum AS ENUM (
    'finished',
    'notfinished',
    'not approved'
);


--
-- Name: user_provider_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_provider_enum AS ENUM (
    'local',
    'google'
);


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'client',
    'freelancer'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation (
    id integer NOT NULL,
    "creatorId" integer,
    "participantId" integer,
    "offreId" integer
);


--
-- Name: conversation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: conversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversation_id_seq OWNED BY public.conversation.id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "conversationId" integer,
    "creatorId" integer,
    "participantId" integer
);


--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    message text NOT NULL,
    checked boolean DEFAULT false NOT NULL,
    purpose character varying(255) NOT NULL,
    "userId" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: offre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offre (
    id integer NOT NULL,
    service character varying(255) NOT NULL,
    description text NOT NULL,
    price character varying(100) NOT NULL,
    "enrolledCount" integer DEFAULT 0 NOT NULL,
    category text[] NOT NULL,
    technologies text[] NOT NULL,
    status public.offre_status_enum DEFAULT 'not approved'::public.offre_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "acceptedId" integer,
    "paymentIntentId" character varying,
    "freelancerStripeAccountId" character varying,
    "clientConfirmed" boolean DEFAULT false NOT NULL,
    "freelancerConfirmed" boolean DEFAULT false NOT NULL,
    "completedAt" timestamp without time zone
);


--
-- Name: offre_enroled_users_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offre_enroled_users_user (
    "offreId" integer NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: offre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.offre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: offre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.offre_id_seq OWNED BY public.offre.id;


--
-- Name: portfolio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio (
    id integer NOT NULL,
    mobile character varying NOT NULL,
    photo character varying,
    description character varying NOT NULL,
    location character varying NOT NULL,
    "portfolioLink" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "totalAmount" integer DEFAULT 0 NOT NULL,
    "thisMonthAmount" integer DEFAULT 0 NOT NULL,
    "previousMonthAmount" integer DEFAULT 0 NOT NULL
);


--
-- Name: portfolio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.portfolio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: portfolio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.portfolio_id_seq OWNED BY public.portfolio.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id integer NOT NULL,
    description text NOT NULL,
    "userId" integer,
    link character varying(255) NOT NULL,
    photo character varying(255) NOT NULL,
    category text[] NOT NULL,
    technologies text[] NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    title character varying(150) NOT NULL
);


--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    password character varying,
    role public.user_role_enum DEFAULT 'client'::public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    provider public.user_provider_enum DEFAULT 'local'::public.user_provider_enum NOT NULL,
    "isEmailConfirmed" boolean DEFAULT false,
    "stripeAccountId" character varying
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: conversation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation ALTER COLUMN id SET DEFAULT nextval('public.conversation_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: offre id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre ALTER COLUMN id SET DEFAULT nextval('public.offre_id_seq'::regclass);


--
-- Name: portfolio id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio ALTER COLUMN id SET DEFAULT nextval('public.portfolio_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: conversation; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.conversation VALUES (1, 16, 14, 14);


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.message VALUES (1, 'Hello! This is a test message.', '2025-11-07 17:23:56.436257', 1, 16, 14);


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notification VALUES (1, 'User 23 enrolled in your offer', false, 'NEW ENRROLLEMENT', 14, '2025-12-17 19:30:40.460071');


--
-- Data for Name: offre; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.offre VALUES (7, 'Full-Stack Web Development', 'I want develop  a complete e-commerce website with authentication, payment inte and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 22:03:50.138263', 13, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (5, 'Full-Stack Web Development', 'I want develop  a complete e-commerce website with authentication, payment inte and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 22:03:46.682459', 13, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (2, 'Full-Stack Web Development', 'I will develop a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 21:28:49.350431', 12, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (6, 'Full-Stack Web Development', 'I want develop  a complete e-commerce website with authentication, payment inte and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 22:03:48.678197', 13, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (9, 'Full-Stack Web Development', 'I want develop  a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 22:04:57.871654', 12, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (8, 'Full-Stack Web Development', 'I want develop  a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 22:03:51.722015', 13, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (3, 'Full-Stack Web Development', 'I want develop  a complete e-commerce website with authentication, payment inte and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 21:28:58.815664', 13, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (4, 'Full-Stack Web d Development', 'I will develop a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-10-26 22:02:22.960006', 13, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (14, 'my service', 'I will develop a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'notfinished', '2025-11-05 19:04:55.902774', 16, 14, 'pi_3SQEdIDnZPNe1Emo1SMhQ3OA', NULL, false, false, NULL);
INSERT INTO public.offre VALUES (11, 'my service', 'I will develop a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'finished', '2025-10-31 18:46:21.609857', 14, 15, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (12, 'Full-Stack Web d Development', 'I will develop a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'not approved', '2025-11-05 18:58:17.767302', 16, NULL, NULL, NULL, false, false, NULL);
INSERT INTO public.offre VALUES (13, 'Full-Stack Web d Development', 'I will develop a complete e-commerce website with authentication, payment integration, and admin dashboard.', '500', 0, '{web,ecommerce,frontend,backend}', '{NestJS,React,PostgreSQL,TailwindCSS}', 'not approved', '2025-11-05 19:03:10.804558', 16, NULL, NULL, NULL, false, false, NULL);


--
-- Data for Name: offre_enroled_users_user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.offre_enroled_users_user VALUES (6, 14);
INSERT INTO public.offre_enroled_users_user VALUES (11, 15);
INSERT INTO public.offre_enroled_users_user VALUES (14, 14);
INSERT INTO public.offre_enroled_users_user VALUES (11, 23);


--
-- Data for Name: portfolio; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.portfolio VALUES (1, '0555123456', 'https://example.com/photo.jpg', 'I am a passionate web developer specializing in backend systems.', 'Algiers, Algeria', 'https://myportfolio.com', '2025-10-24 19:55:44.130579', '2025-10-24 19:55:44.130579', 5, 0, 0, 0);
INSERT INTO public.portfolio VALUES (7, '0555123456', 'https://example.com/photo.jpg', 'I am a passionate web developer specializing in backend systems.', 'Algiers, Algeria', 'https://myportfolio.com', '2025-10-24 20:10:40.329429', '2025-10-24 22:55:24.060507', 8, 0, 0, 0);
INSERT INTO public.portfolio VALUES (9, '0555123456', 'https://example.com/photo.jpg', 'I am a passionate web developer specializing in backend systems.', 'Algiers, Algeria', 'https://myportfolio.com', '2025-10-26 12:40:17.051448', '2025-10-26 12:40:17.051448', 11, 0, 0, 0);
INSERT INTO public.portfolio VALUES (10, '055123456', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1761863223/portfolios-photos/oj4zbhgsvbk6dxjfkkic.jpg', 'Iam Web developer', 'Algeria', 'https://myportfolio.com', '2025-10-30 23:27:04.047394', '2025-10-30 23:27:04.047394', 14, 0, 0, 0);
INSERT INTO public.portfolio VALUES (11, '0794523137', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1764472742/portfolios-photos/filuvrbzjw7jyego0mbm.jpg', 'qlmsdkjfmq', 'relizane', 'http://mylink.com', '2025-11-30 04:19:04.67741', '2025-11-30 04:19:04.67741', 16, 0, 0, 0);
INSERT INTO public.portfolio VALUES (14, '0799283849', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1764943873/portfolios-photos/wlpygnmfjryc5snoooxo.jpg', 'slfjmqlskdjf', 'relizane', 'http://mylink.com', '2025-12-05 15:11:13.625262', '2025-12-05 15:11:13.625262', 24, 0, 0, 0);
INSERT INTO public.portfolio VALUES (20, '0794534137', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1765025868/portfolios-photos/kbwldio7gb776ulopraq.jpg', 'this my profile', 'relizane', 'http://mylink.com', '2025-12-06 13:57:49.31538', '2025-12-06 13:57:49.31538', 25, 0, 0, 0);
INSERT INTO public.portfolio VALUES (21, '0794534137', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1765203782/portfolios-photos/h6cagra6dbzhoh2nqljc.jpg', 'iam dsjfljksdf', 'relizane', 'http://mylink.com', '2025-12-08 15:23:03.984104', '2025-12-08 15:23:03.984104', 26, 0, 0, 0);
INSERT INTO public.portfolio VALUES (12, '0542660481', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1764800144/portfolios-photos/azsvcudhsljayuhdkjl8.jpg', 'a web developer', 'relizane', 'http://mylink.com', '2025-12-03 23:15:44.598315', '2025-12-17 22:46:22.678298', 23, 0, 0, 0);


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.project VALUES (1, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 10, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-25 17:25:34.287631', 'AI Task Manager dsdf');
INSERT INTO public.project VALUES (2, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-25 17:32:26.257327', 'AI Task Managersdf dsdf');
INSERT INTO public.project VALUES (3, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 12:26:25.754419', 'Worlkqkshper');
INSERT INTO public.project VALUES (4, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 12:33:59.578185', 'Worlkqkshper');
INSERT INTO public.project VALUES (5, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 12:34:01.751167', 'Worlkqkshper');
INSERT INTO public.project VALUES (6, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 12:34:43.29376', 'Worlkqkshper');
INSERT INTO public.project VALUES (7, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 13:02:46.40315', 'Worlkqkshper');
INSERT INTO public.project VALUES (8, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 13:02:47.495869', 'Worlkqkshper');
INSERT INTO public.project VALUES (9, 'A smart web application that uses AI to prioritize and manage daily tasks efficiently.', 11, 'https://github.com/semai-mohamed/ai-task-manager', 'https://example.com/images/task-manager.png', '{"Web App",AI,Productivity}', '{NestJS,React,TypeScript,PostgreSQL,"OpenAI API"}', '2025-10-26 13:02:48.495894', 'Worlkqkshper');
INSERT INTO public.project VALUES (12, 'MazeMind is an interactive AI pathfinding visualizer built with Next.js and TypeScript. It allows users to explore and compare classic search algorithms—A*, BFS, and DFS—by watching them solve mazes in real time. Designed as an educational tool for students and enthusiasts, MazeMind makes learning about AI algorithms engaging and intuitive.', 23, 'https://maze-mind-ten.vercel.app/', 'https://res.cloudinary.com/du4xiul4a/image/upload/v1766082784/portfolios-photos/uw1cprclnrng5a5ebmab.png', '{Web,Ai,"Search Algorithme"}', '{"Next js",TypeScript}', '2025-12-18 19:33:06.402564', 'MazeMind-v1');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" VALUES (2, 'Mohamed', 'Semai', 'mohamed@example.com', '$2b$10$Jn81r5srbZqv..5S9eD7Vu7gRbHyE8nlEuAwP1W0Hwmv5Z8sQ/awW', 'client', '2025-10-19 13:34:12.802633', '2025-10-19 13:34:12.802633', 'local', NULL, NULL);
INSERT INTO public."user" VALUES (3, 'Mohamed', 'Semai', 'mohamed@exle.com', '$2b$10$eNZ6h4iuazIwdhMdWr5JdObIJriGQX0lOLpmi/6.rfUtfzqFuQtq6', 'client', '2025-10-19 13:50:40.470999', '2025-10-19 13:50:40.470999', 'local', NULL, NULL);
INSERT INTO public."user" VALUES (6, 'Mohamed', 'Semai', 'mohamed@exlle.com', '$2b$10$MF1lto0vxK2lShY1NjxwmuTOdUsJwG90ee2aMz3jAXx4vRFu/BTp2', 'client', '2025-10-23 03:01:54.090089', '2025-10-23 03:01:54.090089', 'local', false, NULL);
INSERT INTO public."user" VALUES (7, 'Mohamed', 'Semai', 'mohamed@exelle.com', '$2b$10$5j7tPwBWgeKsdpsSNBh8GueneesEdOtn4e1MyoULKrtkI5bsB4PTG', 'client', '2025-10-23 03:08:37.015461', '2025-10-23 03:08:37.015461', 'local', false, NULL);
INSERT INTO public."user" VALUES (8, 'Mohamed', 'Semai', 'mohamed@exedlle.com', '$2b$10$uFnU.q0FoODKBNU2KqP6/e4wS4Yw4CE72XJMTe67F5qPV8p5NZd5W', 'client', '2025-10-23 03:10:48.025702', '2025-10-23 03:10:48.025702', 'local', false, NULL);
INSERT INTO public."user" VALUES (26, 'Mohammed', 'Semai', 'semaimohamed40@gmail.com', '$2b$10$Kp4A2b1VkTY5qtiUvwZLcOYLfoNgGdNWhIaZJup6xlGtK7L5hj4hG', 'freelancer', '2025-12-08 15:22:09.589968', '2025-12-08 15:22:09.589968', 'local', false, NULL);
INSERT INTO public."user" VALUES (23, 'Mohamed', 'Semai', 'semaimohamed0@gmail.com', '$2b$10$uWX8byGJ.l8EyYz5zsM0G.cpv4vWuawSun1LJ65BRJMrajB7cJs7m', 'freelancer', '2025-12-03 22:57:40.096094', '2025-12-17 23:09:07.350975', 'local', false, 'acct_1SfPKXRnoFGeJJJs');
INSERT INTO public."user" VALUES (5, 'mohammed', 'semai', 'm_semai@estin.dz', '$2b$10$XZEPZ27SozWaMgeNS5VkLurZ.uppRyLXJz8.bq8TNSyLhE/vC8M.e', 'admin', '2025-10-22 00:44:04.047956', '2025-10-24 19:46:29.079831', 'google', true, NULL);
INSERT INTO public."user" VALUES (9, 'Mohamed', 'Semai', 'mohamed@exsqdlle.com', '$2b$10$MzLc5MFowx9nidOqYZFsnOByam3tIL3cCVrc44GtYPTpYrGrwFN3W', 'client', '2025-10-24 20:10:18.361489', '2025-10-24 20:10:18.361489', 'local', false, NULL);
INSERT INTO public."user" VALUES (10, 'Mohamed', 'Semai', 'mohamed@exsqdllmme.com', '$2b$10$ASDfZ0LQFYJac7DOps6PseYqTkLuzWOwjBt/bnCCz7lwOoHLfkPgu', 'freelancer', '2025-10-25 17:21:41.398647', '2025-10-25 17:21:41.398647', 'local', false, NULL);
INSERT INTO public."user" VALUES (11, 'Mohamed', 'Semai', 'mohamed@exsqdllmmyese.com', '$2b$10$IKZTBHCOc5iXKfYVcGEYh.WLbh1mKDeKQbnBluUtPgv05ZXajkFnm', 'freelancer', '2025-10-25 17:31:17.48766', '2025-10-25 17:31:17.48766', 'local', false, NULL);
INSERT INTO public."user" VALUES (12, 'Mohamed', 'Semai', 'mohamed@exsqdllmmyesesdd.com', '$2b$10$MyuO08UKYFwTjK/FycxXuOX1mPjU6rlCUjyEmgAMiWakkrX/nKYE.', 'client', '2025-10-26 21:18:02.446447', '2025-10-26 21:18:02.446447', 'local', false, NULL);
INSERT INTO public."user" VALUES (13, 'Mohamed', 'Semai', 'mohamed@exsqdlksldlmmyesesdd.com', '$2b$10$vjWQLICV2skt0C5rD1xZL.H/GwyyRihY6aWaReRyVHmVmR7oS3uNm', 'client', '2025-10-26 21:34:20.891775', '2025-10-26 21:34:20.891775', 'local', false, NULL);
INSERT INTO public."user" VALUES (15, 'Mohamed', 'Semai', 'mohamed@exsqdsklksldsldkjfsllmmyesesdd.com', '$2b$10$wi/oBxtxQ9SFc9XtTSDBx.B7injxPgQCE7CF.LmLU7AVhp5Qa2FiC', 'client', '2025-10-31 18:49:14.614469', '2025-10-31 18:49:14.614469', 'local', false, NULL);
INSERT INTO public."user" VALUES (16, 'Mohamed', 'Semai', 'mohamed@exsqdsklksldslsdlfljdkjfsllmmyesesdd.com', '$2b$10$uNfQqf.4x77empfEG9UkaeKaK64Igao2BWhsfgQzIwSZlMljv/wXu', 'client', '2025-11-05 18:55:57.567811', '2025-11-05 18:55:57.567811', 'local', false, NULL);
INSERT INTO public."user" VALUES (14, 'Mohamed', 'Semai', 'mohamed@exsqdlksldsldkjfsllmmyesesdd.com', '$2b$10$tE8Ch0JXbxRATKOnaHu3e.dtuTh7VeDKpQjOt.TZmmtGfiX3nsDDS', 'freelancer', '2025-10-26 22:06:30.880093', '2025-11-05 21:50:44.997558', 'local', false, 'acct_1SQDchRVzsRnCZOU');
INSERT INTO public."user" VALUES (17, 'Mohamed', 'Semai', 'mohamed@exsqdddsklksldslsdlfljdkjfsllmmyesesdd.com', '$2b$10$h18YzJO5JsigZtkG14VkveR0sG/9HAXEx23eKuj9YGaxngSasSEza', 'client', '2025-11-07 17:40:39.886733', '2025-11-07 17:40:39.886733', 'local', false, NULL);
INSERT INTO public."user" VALUES (18, 'Mohamed', 'Semai', 'mohamed@exsqsdfdddsklksldslsdlfljdkjfsllmmyesesdd.com', '$2b$10$nVTf6Vhhr7Jl5z8/X2mmiODMd1nOjc7wlmk9/LD1Csw4fx2B.E3LG', 'client', '2025-11-08 19:31:58.551639', '2025-11-08 19:31:58.551639', 'local', false, NULL);
INSERT INTO public."user" VALUES (19, 'Mohammed', 'Semai', 'semaimohamed860@gmail.com', '$2b$10$qikv4K/CNdqop.lyAkRA0.PwEus.PF7r5E7jsGWXYfycPyiKWv.FO', 'client', '2025-11-29 23:43:26.216276', '2025-11-29 23:43:26.216276', 'local', false, NULL);
INSERT INTO public."user" VALUES (20, 'Mohammed', 'Semai', 'semaimoham60@gmail.com', '$2b$10$a6Lg5ZZMiOKH5HkX9ZvzTuLIh3KdfajYKyKas8PLqadMLA/jFoYoi', 'client', '2025-11-29 23:50:11.842003', '2025-11-29 23:50:11.842003', 'local', false, NULL);
INSERT INTO public."user" VALUES (21, 'Mohammed', 'Semai', 'semaimohed860@gmail.com', '$2b$10$DqALCnYUlEL5.40IogXUc.4AimbIAvTlRZPBqYURbsedpxLyRPMES', 'client', '2025-11-29 23:51:06.222527', '2025-11-29 23:51:06.222527', 'local', false, NULL);
INSERT INTO public."user" VALUES (22, 'Mohammed', 'Semai', 'mohamed860@gmail.com', '$2b$10$Xg2MiR4s54vzFGP2iQ8SM.3fnkwt7lPtCyDKCqzV1i3Gkln/Uq0nm', 'freelancer', '2025-11-30 02:18:49.483579', '2025-11-30 02:18:49.483579', 'local', false, NULL);
INSERT INTO public."user" VALUES (24, 'mohamed', 'Semai', 'semaimohamed8@gmail.com', '$2b$10$VWYprL41nOMgBcGDTvy0deiIWhlR6rfDbY2owQ8q/Gd2Js0cPaahS', 'freelancer', '2025-12-05 14:57:34.608827', '2025-12-05 14:57:34.608827', 'local', false, NULL);
INSERT INTO public."user" VALUES (25, 'Mohammed', 'Semai', 'semaimohamed6@gmail.com', '$2b$10$iAZiHADLq2Q00bcH5.8efOVByWrf5ZKraCyV.9xIsGN5qBfgbbkve', 'freelancer', '2025-12-06 13:56:52.577148', '2025-12-06 13:56:52.577148', 'local', false, NULL);


--
-- Name: conversation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.conversation_id_seq', 1, true);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.message_id_seq', 1, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_id_seq', 1, true);


--
-- Name: offre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.offre_id_seq', 14, true);


--
-- Name: portfolio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_id_seq', 21, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_id_seq', 12, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 26, true);


--
-- Name: project PK_4d68b1358bb5b766d3e78f32f57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY (id);


--
-- Name: offre PK_5bb50f68a715365f3f98527cb28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT "PK_5bb50f68a715365f3f98527cb28" PRIMARY KEY (id);


--
-- Name: portfolio PK_6936bb92ca4b7cda0ff28794e48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY (id);


--
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- Name: conversation PK_864528ec4274360a40f66c29845; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY (id);


--
-- Name: offre_enroled_users_user PK_ac12a06bf20a87d50782aeebc56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre_enroled_users_user
    ADD CONSTRAINT "PK_ac12a06bf20a87d50782aeebc56" PRIMARY KEY ("offreId", "userId");


--
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: portfolio REL_9d041c43c782a9135df1388ae1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT "REL_9d041c43c782a9135df1388ae1" UNIQUE ("userId");


--
-- Name: IDX_00240d73c5b45c24948271dbc7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_00240d73c5b45c24948271dbc7" ON public.offre_enroled_users_user USING btree ("userId");


--
-- Name: IDX_4706c8842b9cadaa02cff9ece8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_4706c8842b9cadaa02cff9ece8" ON public.offre_enroled_users_user USING btree ("offreId");


--
-- Name: offre_enroled_users_user FK_00240d73c5b45c24948271dbc70; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre_enroled_users_user
    ADD CONSTRAINT "FK_00240d73c5b45c24948271dbc70" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: notification FK_1ced25315eb974b73391fb1c81b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: offre_enroled_users_user FK_4706c8842b9cadaa02cff9ece89; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre_enroled_users_user
    ADD CONSTRAINT "FK_4706c8842b9cadaa02cff9ece89" FOREIGN KEY ("offreId") REFERENCES public.offre(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: offre FK_4e28c17bbff8d9b0f50c3bc06d5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT "FK_4e28c17bbff8d9b0f50c3bc06d5" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: project FK_7c4b0d3b77eaf26f8b4da879e63; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: message FK_7cf4a4df1f2627f72bf6231635f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES public.conversation(id) ON DELETE CASCADE;


--
-- Name: message FK_8b215a0e1be1f32e8dda39d1d42; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_8b215a0e1be1f32e8dda39d1d42" FOREIGN KEY ("participantId") REFERENCES public."user"(id);


--
-- Name: portfolio FK_9d041c43c782a9135df1388ae16; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT "FK_9d041c43c782a9135df1388ae16" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: offre FK_ab0b68695b21d11f88b58c881e8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offre
    ADD CONSTRAINT "FK_ab0b68695b21d11f88b58c881e8" FOREIGN KEY ("acceptedId") REFERENCES public."user"(id);


--
-- Name: message FK_e04040c4ea7133eeddefff6417d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_e04040c4ea7133eeddefff6417d" FOREIGN KEY ("creatorId") REFERENCES public."user"(id);


--
-- Name: conversation FK_e34f5680702b755b819d4a17106; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT "FK_e34f5680702b755b819d4a17106" FOREIGN KEY ("participantId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: conversation FK_e574e8ccf4f31b92ad2d9826045; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT "FK_e574e8ccf4f31b92ad2d9826045" FOREIGN KEY ("creatorId") REFERENCES public."user"(id);


--
-- Name: conversation FK_f0c7d00a9432221c48478611f35; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT "FK_f0c7d00a9432221c48478611f35" FOREIGN KEY ("offreId") REFERENCES public.offre(id);


--
-- PostgreSQL database dump complete
--

\unrestrict nn4XuTp5HnPMd8ESoWF0Yc91h0LpyZIaBH9sWmZTgT6y8YIiwMnRgo7jAeV4uhy

