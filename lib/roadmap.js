export const roadmaps = {
  frontend: {
    title: "Frontend Developer",
    description:
      "Master the art of building beautiful, performant, and accessible web interfaces. This roadmap takes you from raw HTML to advanced React patterns and modern tooling.",
    levels: [
      {
        level: "Beginner",
        color: "#22c55e",
        topics: [
          {
            id: "html",
            label: "HTML",
            description: "The skeleton of every webpage.",
            content: `HTML (HyperText Markup Language) is the standard markup language for creating web pages.
            
Key Concepts:
• Semantic elements: <header>, <main>, <section>, <article>, <footer>
• Forms and input types (text, email, checkbox, radio, select)
• Accessibility with ARIA roles and alt attributes
• Meta tags, SEO basics, and the <head> section
• Tables, lists, media elements (img, video, audio)

Resources:
• MDN Web Docs – HTML Guide
• freeCodeCamp Responsive Web Design
• html.spec.whatwg.org (official spec)`,
          },
          {
            id: "css",
            label: "CSS",
            description: "Style and layout for the web.",
            content: `CSS (Cascading Style Sheets) controls the look and feel of your HTML.
            
Key Concepts:
• Box model: margin, border, padding, content
• Flexbox for 1D layouts
• CSS Grid for 2D layouts
• Responsive design with media queries
• CSS variables (custom properties)
• Transitions and animations
• Pseudo-classes (:hover, :focus) and pseudo-elements (::before, ::after)
• Specificity and the cascade

Resources:
• CSS-Tricks – A Complete Guide to Flexbox / Grid
• Kevin Powell on YouTube
• web.dev/learn/css`,
          },
          {
            id: "js",
            label: "JavaScript",
            description: "Bring interactivity to your pages.",
            content: `JavaScript is the programming language of the web — it makes pages dynamic and interactive.
            
Key Concepts:
• Variables: var, let, const
• Data types, operators, and control flow (if/else, for, while)
• Functions, arrow functions, closures
• DOM manipulation (querySelector, addEventListener)
• Fetch API and Promises (async/await)
• ES6+ features: destructuring, spread, template literals, modules
• Error handling with try/catch
• LocalStorage and SessionStorage

Resources:
• javascript.info (best free JS resource)
• Eloquent JavaScript (free book)
• MDN JavaScript Guide`,
          },
        ],
      },
      {
        level: "Intermediate",
        color: "#eab308",
        topics: [
          {
            id: "git",
            label: "Git & GitHub",
            description: "Version control for your code.",
            content: `Git is a distributed version control system. GitHub hosts your repositories online.
            
Key Concepts:
• git init, add, commit, push, pull, clone
• Branching strategies (main, feature, hotfix)
• Merge vs Rebase
• Pull Requests and code reviews
• .gitignore and best practices
• GitHub Actions basics for CI/CD

Resources:
• Pro Git Book (free at git-scm.com)
• GitHub Docs
• Atlassian Git Tutorials`,
          },
          {
            id: "react",
            label: "React",
            description: "The most popular UI library.",
            content: `React is a JavaScript library for building component-based user interfaces.
            
Key Concepts:
• JSX syntax and components (functional)
• Props and component composition
• useState and useEffect hooks
• useRef, useMemo, useCallback
• Lifting state up and prop drilling
• React Router for client-side routing
• Conditional rendering and lists with keys
• React DevTools

Resources:
• react.dev (official docs)
• Scrimba React Course
• Jack Herrington on YouTube`,
          },
          {
            id: "state",
            label: "State Management",
            description: "Manage complex app state effectively.",
            content: `As apps grow, managing shared state becomes critical. Several libraries solve this.
            
Key Concepts:
• Context API (built into React) for global state
• Zustand – lightweight, modern state manager
• Redux Toolkit – industry standard for large apps
• React Query / TanStack Query for server state
• When to use local vs global state

Resources:
• Redux Toolkit Docs
• Zustand GitHub README
• TkDodo's Blog (React Query)`,
          },
          {
            id: "tailwind",
            label: "Tailwind CSS",
            description: "Utility-first CSS for rapid UI development.",
            content: `Tailwind CSS provides low-level utility classes to build custom designs without writing custom CSS.
            
Key Concepts:
• Utility-first workflow
• Responsive prefixes: sm:, md:, lg:, xl:
• Hover, focus, and active states
• Customizing tailwind.config.js
• Component extraction with @apply
• Dark mode support

Resources:
• tailwindcss.com/docs
• Tailwind UI components
• Fireship Tailwind videos`,
          },
        ],
      },
      {
        level: "Advanced",
        color: "#ef4444",
        topics: [
          {
            id: "nextjs",
            label: "Next.js",
            description: "The React framework for production.",
            content: `Next.js extends React with SSR, SSG, file-based routing, and API routes.
            
Key Concepts:
• App Router vs Pages Router
• Server Components and Client Components
• Static Site Generation (SSG) and Server-Side Rendering (SSR)
• Incremental Static Regeneration (ISR)
• API Routes and Route Handlers
• Image optimization with next/image
• Middleware and edge functions

Resources:
• nextjs.org/docs
• Lee Robinson on YouTube
• Josh tried coding`,
          },
          {
            id: "testing",
            label: "Testing",
            description: "Write reliable, bug-free frontend code.",
            content: `Testing ensures your code behaves correctly as it grows and changes.
            
Key Concepts:
• Unit testing with Vitest or Jest
• Component testing with React Testing Library
• End-to-end testing with Playwright or Cypress
• Mocking API calls with MSW (Mock Service Worker)
• Test-Driven Development (TDD) basics
• Code coverage reports

Resources:
• testing-library.com
• Playwright Docs
• Kent C. Dodds Blog`,
          },
          {
            id: "performance",
            label: "Performance",
            description: "Build fast, optimized web experiences.",
            content: `Web performance directly impacts user experience and SEO rankings.
            
Key Concepts:
• Core Web Vitals: LCP, FID/INP, CLS
• Code splitting and lazy loading
• Image and font optimization
• Caching strategies (service workers, CDN)
• Bundle analysis with Webpack Bundle Analyzer
• Lighthouse audits
• React.memo, useMemo, and Suspense

Resources:
• web.dev/performance
• Chrome DevTools Performance tab
• Josh W. Comeau's blog`,
          },
        ],
      },
    ],
  },

  backend: {
    title: "Backend Developer",
    description:
      "Build the server-side logic, APIs, and databases that power modern applications. From REST APIs to authentication, databases, and deployment.",
    levels: [
      {
        level: "Beginner",
        color: "#22c55e",
        topics: [
          {
            id: "node",
            label: "Node.js",
            description: "JavaScript on the server.",
            content: `Node.js allows you to run JavaScript outside the browser — powering servers, scripts, and CLIs.
            
Key Concepts:
• Node.js runtime and the V8 engine
• Modules: CommonJS (require) and ESModules (import)
• Built-in modules: fs, path, http, os, events
• npm and package.json
• Event loop and asynchronous programming
• Streams and Buffers
• Environment variables with dotenv

Resources:
• nodejs.org/docs
• The Odin Project – NodeJS
• Mosh Node.js Course`,
          },
          {
            id: "api",
            label: "REST API",
            description: "Design and build HTTP APIs.",
            content: `REST (Representational State Transfer) is the standard architecture for web APIs.
            
Key Concepts:
• HTTP methods: GET, POST, PUT, PATCH, DELETE
• Status codes: 200, 201, 400, 401, 403, 404, 500
• Express.js: routing, middleware, error handling
• Request/Response lifecycle
• JSON data format
• API versioning (v1, v2)
• Tools: Postman, Thunder Client, curl

Resources:
• expressjs.com/docs
• REST API Design Rulebook
• Postman Learning Center`,
          },
          {
            id: "auth",
            label: "Authentication",
            description: "Secure your APIs with auth.",
            content: `Authentication verifies who a user is. Authorization determines what they can do.
            
Key Concepts:
• Session-based auth (cookies)
• JWT (JSON Web Tokens) — access and refresh tokens
• OAuth 2.0 and third-party login (Google, GitHub)
• bcrypt for password hashing
• Middleware-based auth guards
• HTTPS and secure cookies
• NextAuth / Auth.js

Resources:
• jwt.io
• OWASP Authentication Cheat Sheet
• Fireship Auth videos`,
          },
        ],
      },
      {
        level: "Intermediate",
        color: "#eab308",
        topics: [
          {
            id: "db",
            label: "Databases",
            description: "Store and query your application data.",
            content: `Every backend needs a database. Know when to use SQL vs NoSQL.
            
Key Concepts:
• SQL: PostgreSQL, MySQL — tables, joins, indexes, transactions
• NoSQL: MongoDB — documents, collections, aggregation
• ORMs: Prisma (Node.js), Sequelize, Mongoose
• Database design: normalization, foreign keys, ERDs
• Migrations and seeding
• Query optimization and EXPLAIN

Resources:
• Prisma Docs
• PostgreSQL Tutorial
• MongoDB University (free)`,
          },
          {
            id: "caching",
            label: "Caching",
            description: "Speed up your app with smart caching.",
            content: `Caching stores frequently-accessed data in fast storage to reduce latency and DB load.
            
Key Concepts:
• In-memory caching with Redis
• HTTP caching: Cache-Control, ETag headers
• CDN caching for static assets
• Cache invalidation strategies (TTL, LRU)
• Memoization patterns
• Database query caching

Resources:
• Redis Docs (redis.io)
• AWS ElastiCache Docs
• Cloudflare Caching Guide`,
          },
          {
            id: "docker",
            label: "Docker",
            description: "Containerize your applications.",
            content: `Docker packages your app and its dependencies into portable containers.
            
Key Concepts:
• Dockerfile syntax (FROM, RUN, COPY, CMD)
• docker build, run, push, pull
• docker-compose for multi-container apps
• Volumes for persistent data
• Environment variables in containers
• Docker Hub and container registries
• Multi-stage builds for production

Resources:
• docs.docker.com
• TechWorld with Nana (YouTube)
• Play with Docker (online lab)`,
          },
        ],
      },
      {
        level: "Advanced",
        color: "#ef4444",
        topics: [
          {
            id: "scaling",
            label: "Scaling",
            description: "Handle millions of users.",
            content: `Scaling ensures your app stays fast and reliable as traffic grows.
            
Key Concepts:
• Vertical scaling (bigger server) vs Horizontal scaling (more servers)
• Load balancing (Nginx, AWS ALB)
• Database replication (primary/replica)
• Message queues: RabbitMQ, Kafka, Bull
• Microservices vs Monolith
• Rate limiting and throttling
• Zero-downtime deployments

Resources:
• Designing Data-Intensive Applications (book)
• Martin Fowler's Blog
• AWS Architecture Center`,
          },
          {
            id: "devops",
            label: "DevOps & CI/CD",
            description: "Automate deployments and infrastructure.",
            content: `DevOps bridges development and operations for faster, reliable delivery.
            
Key Concepts:
• CI/CD pipelines (GitHub Actions, GitLab CI)
• Infrastructure as Code: Terraform, Pulumi
• Cloud providers: AWS, GCP, Azure
• Kubernetes basics (pods, deployments, services)
• Monitoring: Prometheus, Grafana, Datadog
• Logging: ELK stack, Loki
• Blue-green and canary deployments

Resources:
• GitHub Actions Docs
• The DevOps Handbook (book)
• KodeKloud (K8s training)`,
          },
        ],
      },
    ],
  },

  java: {
    title: "Java Developer",
    description:
      "Java powers enterprise applications, Android apps, and high-performance backends. Learn from core syntax to Spring Boot and microservices.",
    levels: [
      {
        level: "Beginner",
        color: "#22c55e",
        topics: [
          {
            id: "java-basics",
            label: "Java Basics",
            description: "Core syntax and fundamentals.",
            content: `Java is a strongly-typed, object-oriented language known for its "write once, run anywhere" principle.
            
Key Concepts:
• JDK, JRE, JVM — how Java runs
• Data types: int, double, boolean, char, String
• Operators, control flow (if, for, while, switch)
• Arrays and ArrayLists
• Methods and method overloading
• Scanner for user input
• Exception handling: try/catch/finally
• Java naming conventions

Resources:
• java.com – Official tutorials
• MOOC.fi Java Programming (free)
• Bro Code Java (YouTube)`,
          },
          {
            id: "oops",
            label: "OOP Concepts",
            description: "Master object-oriented programming.",
            content: `Java is built around OOP — understanding it deeply is essential for any Java developer.
            
Key Concepts:
• Classes and Objects
• Constructors and the 'this' keyword
• Encapsulation: getters and setters
• Inheritance and method overriding
• Polymorphism (compile-time and runtime)
• Abstraction: abstract classes and interfaces
• Static members and singleton pattern
• UML class diagrams

Resources:
• Head First Java (book)
• Java OOP – javatpoint.com
• Coding with John (YouTube)`,
          },
          {
            id: "java-collections",
            label: "Collections & Generics",
            description: "Work with data structures in Java.",
            content: `The Java Collections Framework provides reusable data structures for common programming tasks.
            
Key Concepts:
• List: ArrayList, LinkedList
• Set: HashSet, TreeSet, LinkedHashSet
• Map: HashMap, TreeMap, LinkedHashMap
• Queue and Deque
• Generics (<T>) for type safety
• Iterator and for-each loop
• Comparable and Comparator for sorting
• Collections utility class

Resources:
• Baeldung Java Collections
• Official Java Docs – java.util
• Amigoscode Collections Tutorial`,
          },
        ],
      },
      {
        level: "Intermediate",
        color: "#eab308",
        topics: [
          {
            id: "java-streams",
            label: "Streams & Lambdas",
            description: "Modern, functional Java programming.",
            content: `Java 8 introduced lambdas and the Stream API — transforming how Java developers write code.
            
Key Concepts:
• Lambda expressions and functional interfaces
• Stream pipeline: source → intermediate ops → terminal ops
• filter(), map(), reduce(), collect()
• Optional<T> to handle nulls safely
• Method references (Class::method)
• Parallel streams
• CompletableFuture for async operations

Resources:
• jenkov.com Java Streams Tutorial
• Modern Java in Action (book)
• Baeldung Java 8 Streams`,
          },
          {
            id: "spring-boot",
            label: "Spring Boot",
            description: "The go-to Java web framework.",
            content: `Spring Boot simplifies building production-ready applications with minimal configuration.
            
Key Concepts:
• Spring MVC: @RestController, @GetMapping, @PostMapping
• Dependency Injection with @Autowired and @Component
• Spring Data JPA with Hibernate (ORM)
• @Entity, @Repository, @Service layers
• application.properties / application.yml
• Profiles for dev/prod environments
• Spring Security for authentication
• Actuator for monitoring

Resources:
• spring.io/guides
• Amigoscode Spring Boot (YouTube, free)
• Baeldung.com – Spring tutorials`,
          },
        ],
      },
      {
        level: "Advanced",
        color: "#ef4444",
        topics: [
          {
            id: "java-microservices",
            label: "Microservices",
            description: "Build distributed Java systems.",
            content: `Microservices break monolithic apps into small, independently deployable services.
            
Key Concepts:
• Service discovery with Eureka
• API Gateway with Spring Cloud Gateway
• Inter-service communication: REST and Feign Client
• Message-driven with Apache Kafka
• Distributed tracing with Zipkin / Sleuth
• Circuit breaker with Resilience4j
• Dockerizing Spring Boot apps

Resources:
• Spring Cloud Docs
• Java Microservices Patterns (book)
• SivaLabs on YouTube`,
          },
          {
            id: "java-performance",
            label: "JVM & Performance",
            description: "Tune the JVM for peak performance.",
            content: `Deep JVM knowledge separates good Java developers from great ones.
            
Key Concepts:
• JVM architecture: Heap, Stack, Metaspace
• Garbage collection algorithms: G1, ZGC, Shenandoah
• JVM flags and tuning (-Xms, -Xmx)
• Thread management and concurrency: ExecutorService, synchronized
• Java Flight Recorder and JMC profiler
• Memory leak detection with VisualVM
• Virtual Threads (Project Loom, Java 21+)

Resources:
• Java Performance (book by Scott Oaks)
• Oracle JVM Tuning Guide
• Inside the JVM – Artima (free online)`,
          },
        ],
      },
    ],
  },

  fullstack: {
    title: "Full Stack Developer",
    description:
      "Become a versatile developer capable of building complete applications — from UI to server to database. Combines frontend and backend expertise.",
    levels: [
      {
        level: "Beginner",
        color: "#22c55e",
        topics: [
          {
            id: "frontend-basics",
            label: "Frontend Basics",
            description: "Build what users see.",
            content: `Full stack starts with the frontend — HTML, CSS, and JavaScript are your foundation.
            
Key Concepts:
• HTML structure and semantic markup
• CSS styling, Flexbox, and Grid
• JavaScript DOM manipulation and events
• Responsive design principles
• Basic accessibility (a11y)

Resources:
• The Odin Project (free, project-based)
• freeCodeCamp Responsive Web Design
• CSS-Tricks`,
          },
          {
            id: "backend-basics",
            label: "Backend Basics",
            description: "Build what users don't see.",
            content: `The backend handles business logic, databases, and APIs that the frontend consumes.
            
Key Concepts:
• Node.js and Express for building servers
• HTTP and REST API concepts
• Connecting to a database (MongoDB or PostgreSQL)
• Environment variables and security
• Hosting: Railway, Render, Heroku

Resources:
• The Odin Project – NodeJS Path
• MongoDB Atlas (free tier)
• Express.js Crash Course – Traversy Media`,
          },
        ],
      },
      {
        level: "Intermediate",
        color: "#eab308",
        topics: [
          {
            id: "react-fullstack",
            label: "React + API Integration",
            description: "Connect frontend to backend.",
            content: `A full stack developer wires together React frontends with Express/Next.js backends.
            
Key Concepts:
• Fetching data: fetch(), Axios, React Query
• CORS setup on the server
• Authentication flow: login → JWT → protected routes
• Form handling and validation (React Hook Form, Zod)
• Error boundaries and loading states

Resources:
• react.dev
• TanStack Query Docs
• Dave Gray Full Stack Tutorial`,
          },
          {
            id: "nextjs-fullstack",
            label: "Next.js Full Stack",
            description: "One framework for everything.",
            content: `Next.js lets you build frontend and backend in a single codebase.
            
Key Concepts:
• App Router and Server Components
• Route Handlers (API routes)
• Server Actions for mutations
• Database with Prisma + PostgreSQL
• Auth with NextAuth.js
• Deployment on Vercel

Resources:
• nextjs.org/learn
• Prisma Quickstart
• Josh tried coding (YouTube)`,
          },
          {
            id: "databases-fullstack",
            label: "Databases",
            description: "Store and manage application data.",
            content: `Every full stack app needs a persistent data layer.
            
Key Concepts:
• PostgreSQL with Prisma ORM
• MongoDB with Mongoose
• Data modeling and schema design
• CRUD operations
• Relationships: one-to-many, many-to-many
• Database migrations

Resources:
• Prisma Docs
• MongoDB University
• Neon (serverless Postgres, free tier)`,
          },
        ],
      },
      {
        level: "Advanced",
        color: "#ef4444",
        topics: [
          {
            id: "deployment",
            label: "Deployment & DevOps",
            description: "Ship your apps to production.",
            content: `Deploying reliably is as important as building well.
            
Key Concepts:
• Vercel / Netlify for frontend
• Railway / Fly.io for backend services
• Docker for containerization
• GitHub Actions for CI/CD
• Environment management (dev, staging, prod)
• Domain configuration and SSL

Resources:
• Vercel Docs
• GitHub Actions Docs
• Full Stack Open – Part 11 (CI/CD)`,
          },
          {
            id: "architecture",
            label: "App Architecture",
            description: "Design scalable full stack systems.",
            content: `At scale, architecture decisions define the success of your product.
            
Key Concepts:
• Monolith vs Microservices tradeoffs
• BFF (Backend for Frontend) pattern
• Event-driven architecture with webhooks
• Real-time with WebSockets or SSE
• File storage with AWS S3 or Cloudinary
• Background jobs and queues (Bull, Inngest)

Resources:
• Martin Fowler – Patterns of Enterprise Architecture
• Bytes.dev newsletter
• Theo (t3.gg) on YouTube`,
          },
        ],
      },
    ],
  },

  "data-analyst": {
    title: "Data Analyst",
    description:
      "Transform raw data into actionable insights. Learn Excel, SQL, Python, and visualization tools used by analysts at top companies.",
    levels: [
      {
        level: "Beginner",
        color: "#22c55e",
        topics: [
          {
            id: "excel",
            label: "Excel / Sheets",
            description: "The analyst's first tool.",
            content: `Spreadsheets are the universal tool for data analysis — every analyst must master them.
            
Key Concepts:
• Formulas: SUM, IF, VLOOKUP, INDEX/MATCH
• PivotTables and PivotCharts
• Conditional formatting
• Data validation and dropdowns
• Power Query for data cleaning
• XLOOKUP and dynamic arrays (Excel 365)

Resources:
• Excel for the Real World (Udemy)
• ExcelJet.net
• Chandoo.org`,
          },
          {
            id: "sql",
            label: "SQL",
            description: "Query databases like a pro.",
            content: `SQL is the most important skill for any data analyst — you'll use it every single day.
            
Key Concepts:
• SELECT, WHERE, ORDER BY, LIMIT
• Aggregate functions: COUNT, SUM, AVG, MIN, MAX
• GROUP BY and HAVING
• JOINs: INNER, LEFT, RIGHT, FULL OUTER
• Subqueries and CTEs (WITH clause)
• Window functions: ROW_NUMBER, RANK, LAG, LEAD
• Date functions and string manipulation

Resources:
• Mode Analytics SQL Tutorial
• sqlzoo.net (interactive)
• pgexercises.com`,
          },
          {
            id: "statistics",
            label: "Statistics Basics",
            description: "Understand the data you work with.",
            content: `Statistical literacy helps you ask the right questions and interpret data correctly.
            
Key Concepts:
• Descriptive stats: mean, median, mode, std dev
• Distributions: normal, skewed, bimodal
• Correlation vs causation
• Probability fundamentals
• Hypothesis testing basics (A/B tests)
• Confidence intervals
• Data types: nominal, ordinal, interval, ratio

Resources:
• Khan Academy Statistics
• Statistics in Plain English (book)
• StatQuest with Josh Starmer (YouTube)`,
          },
        ],
      },
      {
        level: "Intermediate",
        color: "#eab308",
        topics: [
          {
            id: "python-data",
            label: "Python for Data",
            description: "Automate and scale your analysis.",
            content: `Python is the most popular language for data analysis — pandas and matplotlib are essential.
            
Key Concepts:
• pandas: DataFrames, Series, groupby, merge
• NumPy for numerical operations
• matplotlib and seaborn for visualization
• Data cleaning: handle nulls, duplicates, dtypes
• Exploratory Data Analysis (EDA)
• Reading CSV, Excel, JSON, APIs
• Jupyter Notebooks workflow

Resources:
• Kaggle Python & Pandas courses (free)
• Python for Data Analysis (Wes McKinney book)
• Real Python – Data Analysis`,
          },
          {
            id: "visualization",
            label: "Data Visualization",
            description: "Tell stories with charts and dashboards.",
            content: `Great analysts communicate findings visually — choosing the right chart matters.
            
Key Concepts:
• Chart types: bar, line, scatter, heatmap, funnel
• Dashboard design principles
• Power BI: reports, DAX formulas, data models
• Tableau: worksheets, dashboards, LOD expressions
• Looker Studio (formerly Data Studio) — free
• Color theory and accessibility in charts

Resources:
• Storytelling with Data (book)
• Microsoft Power BI Learning Path
• Tableau Public Gallery for inspiration`,
          },
        ],
      },
      {
        level: "Advanced",
        color: "#ef4444",
        topics: [
          {
            id: "analytics-engineering",
            label: "Analytics Engineering",
            description: "Build reliable data pipelines.",
            content: `Analytics engineering bridges data engineering and analysis — dbt is the key tool.
            
Key Concepts:
• dbt (data build tool) — models, tests, documentation
• Data warehouses: BigQuery, Snowflake, Redshift
• Star schema and dimensional modeling
• ETL vs ELT pipelines
• Data freshness, lineage, and observability
• Orchestration with Airflow or Prefect

Resources:
• dbt Learn (free)
• Fundamentals of Data Engineering (book)
• Select Star SQL`,
          },
          {
            id: "ml-basics",
            label: "ML for Analysts",
            description: "Apply machine learning to your data.",
            content: `Analysts who understand ML can build predictive models and collaborate with data scientists.
            
Key Concepts:
• Supervised learning: regression, classification
• scikit-learn: fit, predict, evaluate
• Feature engineering and selection
• Train/test splits and cross-validation
• Model evaluation: RMSE, accuracy, F1
• Gradient Boosting: XGBoost, LightGBM
• Forecasting with Prophet

Resources:
• Kaggle Intro to Machine Learning (free)
• Hands-On ML with scikit-learn (book)
• fast.ai Practical Deep Learning`,
          },
        ],
      },
    ],
  },

  "system-design": {
    title: "System Design",
    description:
      "Learn to architect large-scale distributed systems. This roadmap covers everything from load balancers to CAP theorem — essential for senior engineers.",
    levels: [
      {
        level: "Beginner",
        color: "#22c55e",
        topics: [
          {
            id: "networking",
            label: "Networking Basics",
            description: "The foundation of distributed systems.",
            content: `Understanding how computers communicate is prerequisite to system design.
            
Key Concepts:
• HTTP/HTTPS, TCP/IP, UDP
• DNS — how domain resolution works
• Latency, bandwidth, throughput
• IP addresses, ports, and sockets
• REST vs GraphQL vs gRPC
• WebSockets for real-time communication
• CDN (Content Delivery Networks)

Resources:
• Computer Networking: A Top-Down Approach
• Cloudflare Learning Center (free)
• ByteByteGo Newsletter`,
          },
          {
            id: "databases-sd",
            label: "Database Fundamentals",
            description: "Choosing and scaling databases.",
            content: `Database choice is one of the most impactful system design decisions.
            
Key Concepts:
• SQL vs NoSQL tradeoffs
• ACID properties (Atomicity, Consistency, Isolation, Durability)
• Indexing strategies (B-tree, hash)
• Replication: primary-replica, multi-primary
• Sharding strategies (range, hash, geo)
• CAP Theorem and BASE properties
• NewSQL databases (CockroachDB, Spanner)

Resources:
• Designing Data-Intensive Applications (Kleppmann)
• Use The Index, Luke (free)
• Database Internals (book)`,
          },
        ],
      },
      {
        level: "Intermediate",
        color: "#eab308",
        topics: [
          {
            id: "scalability",
            label: "Scalability",
            description: "Design for millions of users.",
            content: `Scalability is the ability to handle growing load without degrading performance.
            
Key Concepts:
• Horizontal vs vertical scaling
• Stateless services and sticky sessions
• Caching layers: Redis, Memcached, CDN
• Async processing with message queues (Kafka, RabbitMQ, SQS)
• Database connection pooling
• Rate limiting algorithms (token bucket, leaky bucket)
• Auto-scaling in cloud environments

Resources:
• High Scalability Blog
• AWS Well-Architected Framework
• Martin Fowler – Patterns of Enterprise Architecture`,
          },
          {
            id: "loadbalancer",
            label: "Load Balancing",
            description: "Distribute traffic across servers.",
            content: `Load balancers are the entry point to distributed systems — understanding them is fundamental.
            
Key Concepts:
• L4 (transport) vs L7 (application) load balancers
• Algorithms: Round Robin, Least Connections, IP Hash, Weighted
• Health checks and failover
• Nginx and HAProxy configuration
• AWS Elastic Load Balancer (ALB, NLB, CLB)
• SSL termination at the load balancer
• Global load balancing with DNS (GeoDNS, Anycast)

Resources:
• Nginx Docs
• AWS ELB Documentation
• Fundamentals of Software Architecture (book)`,
          },
          {
            id: "api-design",
            label: "API Design",
            description: "Design APIs that scale and evolve.",
            content: `Well-designed APIs are the contracts between services — they need to last.
            
Key Concepts:
• RESTful API best practices
• GraphQL: schemas, resolvers, queries, mutations
• gRPC and Protocol Buffers for low-latency services
• API versioning strategies (/v1, headers, query params)
• Pagination: offset, cursor-based, keyset
• Rate limiting and throttling
• API Gateway patterns (Kong, AWS API Gateway)

Resources:
• API Design Patterns (book)
• Stripe API — gold standard example
• Google API Design Guide (aip.dev)`,
          },
        ],
      },
      {
        level: "Advanced",
        color: "#ef4444",
        topics: [
          {
            id: "distributed-systems",
            label: "Distributed Systems",
            description: "Tackle consistency and fault tolerance.",
            content: `Distributed systems are complex — failures are inevitable and consistency is hard.
            
Key Concepts:
• Consensus algorithms: Raft, Paxos
• Eventual consistency and conflict resolution (CRDTs)
• Distributed transactions and Two-Phase Commit (2PC)
• Saga pattern for microservices transactions
• Leader election and service discovery
• Gossip protocols and vector clocks
• Chaos engineering (Netflix Chaos Monkey)

Resources:
• DDIA (Designing Data-Intensive Applications)
• Papers We Love (distributed systems papers)
• MIT 6.824 Distributed Systems (YouTube)`,
          },
          {
            id: "system-design-interviews",
            label: "Interview Prep",
            description: "Ace system design rounds at top companies.",
            content: `System design interviews require structured thinking, breadth of knowledge, and communication.
            
Framework:
1. Clarify requirements (functional + non-functional)
2. Estimate scale (QPS, storage, bandwidth)
3. High-level design (components + data flow)
4. Deep dive (bottlenecks, trade-offs)
5. Wrap up (monitoring, alerts, failure scenarios)

Common System Design Questions:
• Design URL Shortener (bit.ly)
• Design Twitter / Instagram Feed
• Design WhatsApp / Chat System
• Design YouTube / Netflix
• Design Uber / Ride Sharing
• Design Google Search
• Design a Rate Limiter
• Design a Distributed Cache

Resources:
• System Design Interview (Alex Xu, Vol 1 & 2)
• ByteByteGo (YouTube + book)
• Grokking Modern System Design (EducativeIO)`,
          },
        ],
      },
    ],
  },
};

export function getRoadmapData(slug) {
  return roadmaps[slug] ?? null;
}