# HR Uygulaması

Modern ve kapsamlı bir İnsan Kaynakları yönetim sistemi. Bu uygulama, İngilizce testleri, beceri ve kişilik değerlendirmeleri ile Product Owner simülasyonları sunarak işe alım süreçlerini dijitalleştirir.

## Özellikler

### Kimlik Doğrulama ve Güvenlik

-   NextAuth.js tabanlı güvenli oturum yönetimi
-   JWT token kullanarak stateless authentication
-   Rol bazlı erişim kontrolü (admin/user)
-   Middleware ile sayfa seviyesinde güvenlik kontrolü
-   bcrypt ile şifrelenmiş password saklama

### Test Yönetimi

-   İngilizce seviye testleri oluşturma ve yönetimi
-   Beceri ve kişilik değerlendirme testleri
-   Otomatik test atama sistemi
-   Zaman sınırı ile test alma
-   Gerçek zamanlı test ilerlemesi takibi
-   Detaylı sonuç raporları ve analiz

### Product Owner Simülasyonları

-   AWS Bedrock Claude AI ile dinamik içerik üretimi
-   Team Meeting senaryoları
-   Backlog Prioritization görevleri
-   User Story Writing alıştırmaları
-   Gerçek zamanlı performans değerlendirmesi

### Yönetim Paneli

-   Kullanıcı yönetimi ve rol atama
-   Test sonuçlarının detaylı analizi
-   Atanmış testlerin takibi
-   Kapsamlı raporlama araçları
-   Data table ile gelişmiş filtreleme

## Teknoloji Stack

### Core Framework

-   **Framework**: Next.js 14 (App Router)
-   **Runtime**: React 18 (Concurrent Features)
-   **Language**: JavaScript (JSDoc ile type hints)

### Database & Backend

-   **Database**: MongoDB
-   **ORM**: Prisma 5.20.0
-   **Authentication**: NextAuth.js v4
-   **API Client**: Axios

### AI Integration

-   **Primary AI**: AWS Bedrock (Claude 3 Sonnet)
-   **SDK**: @aws-sdk/client-bedrock-runtime
-   **Backup**: @anthropic-ai/sdk

### UI & Styling

-   **UI Library**: Radix UI (Headless Components)
-   **Styling**: Tailwind CSS 3.4.1
-   **Animations**: Framer Motion
-   **Icons**: Lucide React + Radix Icons
-   **Themes**: next-themes (Dark/Light mode)

### State Management

-   **Server State**: TanStack Query (React Query)
-   **Client State**: React useState/useReducer
-   **Form State**: React Hook Form + Zod validation

### Data Visualization

-   **Tables**: TanStack React Table
-   **Drag & Drop**: @hello-pangea/dnd
-   **Charts**: Built-in components

### Developer Experience

-   **Linting**: ESLint + Next.js config
-   **Build Tools**: PostCSS + Tailwind
-   **Development**: Hot reload + Query devtools

## Veritabanı Mimarisi

### MongoDB Schema Design

#### Core Models

**User Model**

```prisma
model User {
  id                            String   @id @default(auto()) @map("_id") @db.ObjectId
  email                         String   @unique
  hashedPassword                String
  role                          String   @default("user")  // "user" | "admin"
  createdAt                     DateTime @default(now())
  updatedAt                     DateTime @updatedAt

  // Relations
  assignedTests                 AssignedTest[]
  assignedSkillPersonalityTests AssignedSkillPersonalityTest[]
  ProductOwnerSimulation        ProductOwnerSimulation[]
}
```

**EnglishTest Model**

```prisma
model EnglishTest {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  level         String   // "Beginner" | "Intermediate" | "Advanced"
  questions     Json     // Flexible question structure
  createdAt     DateTime @default(now())
  createdBy     String   @db.ObjectId

  // Relations
  assignedTests AssignedTest[]
}
```

**AssignedTest Model (Test Assignment & Progress)**

```prisma
model AssignedTest {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  userId        String    @db.ObjectId
  testId        String    @db.ObjectId
  assignedAt    DateTime  @default(now())
  completedAt   DateTime? // Nullable - test may not be completed
  score         Int?      // Nullable - may not be scored yet
  startedAt     DateTime? // Test start time
  timeRemaining Int?      // Remaining time in seconds
  answers       Json?     // User responses

  // Relations
  user          User        @relation(fields: [userId], references: [id])
  test          EnglishTest @relation(fields: [testId], references: [id])
}
```

**SkillPersonalityTest Model**

```prisma
model SkillPersonalityTest {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  sections      Json     // Different test sections (skill, personality, etc.)
  createdAt     DateTime @default(now())
  createdBy     String   @db.ObjectId

  // Relations
  assignedTests AssignedSkillPersonalityTest[]
}
```

**AssignedSkillPersonalityTest Model**

```prisma
model AssignedSkillPersonalityTest {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  userId        String    @db.ObjectId
  testId        String    @db.ObjectId
  assignedAt    DateTime  @default(now())
  completedAt   DateTime?
  startedAt     DateTime?
  timeRemaining Int?
  answers       Json?     // User responses
  results       Json?     // AI analysis results

  // Relations
  user          User                 @relation(fields: [userId], references: [id])
  test          SkillPersonalityTest @relation(fields: [testId], references: [id])
}
```

**ProductOwnerSimulation Model (AI-Powered Simulations)**

```prisma
model ProductOwnerSimulation {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  userId                String    @db.ObjectId
  startedAt             DateTime  @default(now())
  completedAt           DateTime?
  currentTask           String?   // Current task identifier
  teamMeeting           Json?     // Team meeting scenarios (AI generated)
  backlogPrioritization Json?     // Backlog prioritization tasks
  userStoryWriting      Json?     // User story writing exercises
  score                 Int?      // Overall performance score

  // Relations
  user                  User      @relation(fields: [userId], references: [id])
}
```

### Database Features

**🔍 Key Design Decisions**

-   **MongoDB ObjectId**: Native MongoDB ID usage
-   **JSON Storage**: Flexible schema for questions, answers, and AI results
-   **Nullable Fields**: Support for incomplete/in-progress tests
-   **Time Tracking**: Comprehensive timestamp management
-   **Relational Design**: Proper foreign key relationships despite NoSQL

**📊 Data Relationships**

-   **One-to-Many**: User → AssignedTests
-   **One-to-Many**: User → Simulations
-   **Many-to-One**: AssignedTest → EnglishTest
-   **Cascade Operations**: Handled at application level

## Mimari Yaklaşım

### Feature-Based Architecture

Proje, özellik bazlı (feature-based) mimari kullanarak organize edilmiştir. Bu yaklaşım, kod organizasyonunu iyileştirir ve maintainability sağlar.

#### Feature Yapısı

Her feature aşağıdaki standart yapıyı takip eder:

```
features/[feature-name]/
├── components/          # Feature'a özel UI bileşenleri
├── services/           # API çağrıları ve business logic
├── queries/            # TanStack Query hooks
└── constants/          # Sabitler ve konfigürasyonlar
```

#### Mevcut Features

**🔐 Auth Feature (`features/auth/`)**

-   **Components**: LoginForm, RegisterForm
-   **Services**: login(), register() functions
-   **Queries**: useLogin, useRegister hooks
-   **Constants**: Auth endpoints

**👥 Users Feature (`features/users/`)**

-   **Components**: UserTable, UserTableActions, DeleteUserDialog, LoadingState
-   **Services**: fetchUsers(), updateUserRole(), deleteUser()
-   **Queries**: useFetchUsers, useUpdateUserRole, useDeleteUser
-   **Constants**: User management endpoints

**⚙️ Account Feature (`features/account/`)**

-   **Components**: AccountForm
-   **Services**: updateAccount()
-   **Queries**: useUpdateAccount
-   **Constants**: Account endpoints

**🏠 Home Feature (`features/home/`)**

-   **Data**: Static content configuration (features, steps, interview types)
-   Landing page için yapılandırılmış data structures

### Service Layer Pattern

Her feature, service layer pattern kullanarak API çağrılarını soyutlar:

```javascript
// Örnek Service
export const fetchUsers = async () => {
    const response = await axios.get(Endpoints.USERS.DEFAULT)
    return response.data
}
```

### Custom Query Hooks

TanStack Query ile optimize edilmiş data fetching:

```javascript
// Örnek Query Hook
const useFetchUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    })
}
```

### Mutation Patterns

Consistent mutation handling ve error management:

```javascript
// Örnek Mutation
const useUpdateUserRole = () => {
    return useMutation({
        mutationFn: updateUserRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('Rol başarıyla güncellendi')
        },
    })
}
```

## Güvenlik Mimarisi

### Middleware Koruması

Uygulama, middleware seviyesinde güvenlik kontrolü sağlar:

-   **Public Routes**: `/`, `/login`, `/register`
-   **Protected Routes**: Tüm `/panel/*` sayfaları
-   **Role-based Access**: Admin ve user rolleri için farklı erişim seviyeleri

### API Güvenliği

-   Tüm API endpoints server-side session kontrolü
-   Admin yetkisi gerektiren işlemler için ek güvenlik katmanı
-   CORS ve rate limiting koruması

## Kurulum

1. Projeyi klonlayın:

```bash
git clone <repository-url>
cd hr-app-v1
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:

```bash
cp .env.example .env.local
```

4. Veritabanı şemasını güncelleyin:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## Ortam Değişkenleri

```env
# Database
DATABASE_URL=mongodb://...

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AWS Bedrock (Product Owner Simulations)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Build Scripts

```bash
# Development
npm run dev                    # Start development server
npm run lint                   # Run ESLint

# Database
npm run prisma:generate        # Generate Prisma client
npm run prisma:push           # Push schema to database

# Production
npm run build                 # Build for production (includes prisma generate)
npm start                     # Start production server
```

## API Endpoints

### Kimlik Doğrulama

-   `POST /api/register` - Kullanıcı kaydı
-   `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Kullanıcı Yönetimi (Admin Only)

-   `GET /api/users` - Kullanıcı listesi
-   `POST /api/users/update-role` - Rol güncelleme
-   `POST /api/users/delete` - Kullanıcı silme

### İngilizce Testleri

-   `GET /api/english-test` - Test listesi
-   `POST /api/english-test/create` - Test oluşturma
-   `POST /api/english-test/assign` - Test atama
-   `GET /api/english-test/assigned/[id]` - Atanmış test detayı
-   `POST /api/english-test/submit` - Test sonucu gönderme

### Beceri ve Kişilik Testleri

-   `GET /api/skill-personality-test` - Test listesi
-   `POST /api/skill-personality-test/create` - Test oluşturma
-   `POST /api/skill-personality-test/assign` - Test atama
-   `GET /api/skill-personality-test/results` - Sonuçlar

### Product Owner Simülasyonları

-   `POST /api/product-owner-simulation` - Simülasyon başlatma
-   `GET /api/product-owner-simulation/[id]` - Simülasyon detayı
-   `POST /api/product-owner-simulation/[id]/complete-task` - Görev tamamlama

### Hesap Yönetimi

-   `POST /api/account/update` - Profil güncelleme

## Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── panel/             # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── main/              # Main feature components
│   └── ui/                # Base UI components (Radix)
├── features/              # Feature-based organization
│   ├── auth/              # Authentication feature
│   │   ├── components/    # LoginForm, RegisterForm
│   │   ├── services/      # Auth API calls
│   │   ├── queries/       # TanStack Query hooks
│   │   └── constants/     # Auth endpoints
│   ├── users/             # User management feature
│   │   ├── components/    # UserTable, UserActions, etc.
│   │   ├── services/      # User CRUD operations
│   │   ├── queries/       # User query hooks
│   │   └── constants/     # User endpoints
│   ├── account/           # Account management feature
│   │   ├── components/    # AccountForm
│   │   ├── services/      # Account services
│   │   ├── queries/       # Account mutations
│   │   └── constants/     # Account endpoints
│   └── home/              # Home page data
│       └── data.js        # Static content configuration
├── lib/                   # Utilities and configurations
│   ├── AuthOptions.js     # NextAuth configuration
│   ├── prismadb.js        # Prisma client
│   └── utils.js           # Helper functions
├── prisma/                # Database schema
│   └── schema.prisma      # Database models and relations
├── providers/             # React context providers
└── middleware.js          # Route protection
```

## Component Patterns

### UI Component Hierarchy

```
components/ui/              # Base UI components (Radix UI)
├── button.jsx             # Button primitives
├── dialog.jsx             # Modal dialogs
├── table.jsx              # Data tables
└── ...

components/main/            # Application-specific components
├── LogoutButton.jsx        # Logout functionality
├── TestButton.jsx         # Test management
└── ...

features/[feature]/components/  # Feature-specific components
├── [Feature]Form.jsx      # Forms
├── [Feature]Table.jsx     # Data tables
└── [Feature]Actions.jsx   # Action components
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

Production ortamında aşağıdaki servislerin yapılandırılması gerekir:

-   MongoDB Atlas veya MongoDB instance
-   AWS Bedrock erişimi (Product Owner simülasyonları için)
-   SSL sertifikası (HTTPS)

## Geliştirme Notları

### Code Style

-   ESLint ve Prettier kullanımı
-   Feature-based modular organization
-   Custom hooks ile logic separation
-   Consistent naming conventions

### Performance

-   Server-side rendering (SSR)
-   Dynamic imports ile code splitting
-   TanStack Query ile efficient caching
-   Image optimization

### Patterns

-   Service Layer Pattern for API abstraction
-   Custom Query Hooks for data fetching
-   Consistent error handling with toast notifications
-   Form validation with React Hook Form + Zod

### Dependencies Management

-   **Production Dependencies**: 43 packages
-   **Development Dependencies**: 5 packages
-   **Package Size**: Optimized bundle size
-   **Security**: Regular dependency updates
