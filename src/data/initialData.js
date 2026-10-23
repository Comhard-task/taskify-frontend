export const INITIAL_TEAM = [
  {
    id: 'alex',
    name: 'Alex Morgan',
    role: 'Lead Architect',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArvYOHb0Dr0WbkVYIK1inf7aBGxDJkZMQy_rdIIqpugqzdmTxAaLAlFmCsMwfEu05xAQZgfu_6S1RYdoHg2LInkg0JrhLVbJ7H55uw9THUvRSgGd6-lbLbV7BAbh9mWTrorIu54_B5NMOm5kZo-M1iP9EciSsZWg_UtuHIQd35wPGio72kFHk1CZoy66lBZZQeNUdwyAWuo8UIzmtNv9PSrAkMALPGGXBF-TKTPsG_0cXgUdZZNtsi',
    email: 'alex.morgan@acme.corp'
  },
  {
    id: 'david',
    name: 'David K.',
    role: 'Security Core Lead',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVMCZLrpcAA3ZtIEtw7xc7CczjDZi2ySEU3cEyZXowYmkPO4GB2yyt2omsujw6bGjPHBPP7FBeZLad_YsIMGNlyDCghnXEAlEkqvLsUsh23BrMaLuJlEwd-sLyj65-dzOZACGnCBPPjAwEAFoMVRaYTr0We4qer-8Wxd4-69meTZYQSlIYL2ATj0UAFFK7vvvvAIHraKoU3TA2MSAdt_2Kc0ZPdrvkYq6g8bOv5i3NWkO-lmSq-u6T',
    email: 'david.k@acme.corp'
  },
  {
    id: 'elena',
    name: 'Elena R.',
    role: 'DevOps & Reliability',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0RkFgcTVYyHjuaqe8D0JlcMRXvXHIAVkna4svz2GQIQ1RwiYNuujBFQmo7PfMwWdlrgZIEnxpNUfaSfAWPUL4FORDBRFkxlrQ2Yowce1z2J-DJ5zYPPbSzM4TMy1TLr_6teFMY3UGMK88q39Vz0w6GmWWp2QUSL2Kp_wme0rApQpmbRA54uCtslQnHd96Swt9xb66V2cSA081_gjtpx6JEmkx6ZRPoJgyXZ2Nv_xIct6b6BJZdoAd',
    email: 'elena.r@acme.corp'
  },
  {
    id: 'marcus',
    name: 'Marcus V.',
    role: 'Full Stack Engineer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeLjC25ukLPZmNDrNzbev9QpvaHVWYu74SDqKPBAXz1S2b_WL9EwCSC5eMH2YboTMr_Svo56iTOxTF0iQPei4iTT6ee1waaw0wCUWq2a--bhw9gjdymeZzsrZmosM7BHK16Yrp9DdLIN0ke_qPYm4HFHcgu3dd7BN52hQUMsEE5MoF_1BKLM_IRC_50nGHDN17F1Iz-DVrh04cccBQbijXR2W32qO4QIXx-fv4sTmXJZrAcVrAGROu',
    email: 'marcus.v@acme.corp'
  },
  {
    id: 'chloe',
    name: 'Chloe T.',
    role: 'Backend Platform',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG55sqGLdgoEiSXUEa5SrMVfPZL-iojh88bNgrWwZF71KIw16Rj1j5FpYtzPcLZjaxf3zYx59uN2-iD_lwv0MBBAOZ8e0wta7ao5KCEmsjknDb-3h3n-1rGt0KykYPTveutCWJZzPp5Cd71TJ4zJ54gQHQHxmoFOg6RKNQ-QlZADb9rvsWpahnOxwdAv8qrycvjH9hRSCQHfBy2lr9t3ZpeuDTFiORuYB44PTn-mxVO_tfzl45c8jO',
    email: 'chloe.t@acme.corp'
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwLPXwc8Tl8vYIzy88ApdQwB2K6p1AExLEHZ7mOftAxbq9xXT0FEWqr41GnMyl0hhLXbZU2yHfh_dOfmnWd7myr_Aq2j825uN4L5T1hdaoTTxDYijMW3BFTPbiF0qecndaysVtjq2aYJNAZdL6x6QVFejenzoLyBItVytzRPI096mr3Mui37xlA-1eUBqxDZhOXmb-g5WbDyf3r-kz9bbKSHH1UH97qOsMe03UgV1br658dWi7pgRu',
    email: 'sarah.c@acme.corp'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'CORE-819',
    title: 'Global Auth Cluster SSO & SAML 2.0 Migration',
    summary: 'Upgrade multi-tenant enterprise IDP connectors with automated metadata synchronization.',
    stage: 'In Review',
    isBlocked: true,
    priority: 'Urgent',
    assignee: 'David K.',
    assigneeAvatar: INITIAL_TEAM[1].avatar,
    dueDate: 'Today, 5:00 PM',
    cluster: 'Security Core',
    points: 8,
    tags: ['Auth', 'SAML', 'Enterprise'],
    commentsCount: 8,
    subtasks: [
      { text: 'Validate Okta IdP XML parser', completed: true },
      { text: 'Provision Azure AD test claims', completed: true },
      { text: 'Resolve signature algorithm mismatch', completed: false },
      { text: 'Pass SOC2 regression suite', completed: false },
    ],
    completed: false,
    createdAt: '2026-10-21'
  },
  {
    id: 'INFRA-402',
    title: 'PostgreSQL Multi-Region Read Replica Failover Test',
    summary: 'Automate read-replica heartbeats and failover orchestration across us-east and eu-central.',
    stage: 'In Review',
    isBlocked: false,
    priority: 'High',
    assignee: 'Elena R.',
    assigneeAvatar: INITIAL_TEAM[2].avatar,
    dueDate: 'Tomorrow',
    cluster: 'Platform Infra',
    points: 5,
    tags: ['Database', 'Postgres', 'Resilience'],
    commentsCount: 4,
    subtasks: [
      { text: 'Simulate region network partition', completed: true },
      { text: 'Verify automated DNS redirection latency <15s', completed: true },
      { text: 'Audit replica lag during peak TPS injection', completed: true },
      { text: 'Finalize runbook documentation', completed: false }
    ],
    completed: false,
    createdAt: '2026-10-20'
  },
  {
    id: 'FIN-104',
    title: 'Stripe Custom Billing Webhook Resilience Upgrade',
    summary: 'Implement idempotent event deduplication using distributed Redis lease tokens.',
    stage: 'In Progress',
    isBlocked: false,
    priority: 'High',
    assignee: 'Marcus V.',
    assigneeAvatar: INITIAL_TEAM[3].avatar,
    dueDate: 'Oct 28',
    cluster: 'Billing Core',
    points: 5,
    tags: ['FinTech', 'Webhooks', 'Stripe'],
    commentsCount: 3,
    subtasks: [
      { text: 'Implement Redis event signature cache', completed: true },
      { text: 'Handle out-of-order charge.failed retries', completed: true },
      { text: 'Bench test 20,000 req/sec replay attack', completed: false }
    ],
    completed: false,
    createdAt: '2026-10-19'
  },
  {
    id: 'PERF-88',
    title: 'API Response Cache Layer via Cloudflare Workers',
    summary: 'Deploy edge stale-while-revalidate caching rule to decrease P99 latency by 35%.',
    stage: 'In Progress',
    isBlocked: false,
    priority: 'Medium',
    assignee: 'Chloe T.',
    assigneeAvatar: INITIAL_TEAM[4].avatar,
    dueDate: 'Oct 29',
    cluster: 'Edge Platform',
    points: 3,
    tags: ['Edge', 'Cloudflare', 'Latency'],
    commentsCount: 6,
    subtasks: [
      { text: 'Write Worker route matching script', completed: true },
      { text: 'Configure cache tags for granular purge', completed: true },
      { text: 'P99 latency dashboard alert hook', completed: false }
    ],
    completed: false,
    createdAt: '2026-10-18'
  },
  {
    id: 'SEC-512',
    title: 'SOC2 Compliance Audit Artifact Exports (Batch 1)',
    summary: 'Consolidate AWS CloudTrail, access logs, and PR sign-off signatures for external auditors.',
    stage: 'Completed',
    isBlocked: false,
    priority: 'High',
    assignee: 'Alex Morgan',
    assigneeAvatar: INITIAL_TEAM[0].avatar,
    dueDate: 'Finished',
    cluster: 'Governance',
    points: 5,
    tags: ['Compliance', 'Audit', 'SOC2'],
    commentsCount: 2,
    subtasks: [
      { text: 'Export IAM policy diff ledger', completed: true },
      { text: 'Generate KMS key rotation verification PDF', completed: true },
      { text: 'Upload tarball to auditor vault', completed: true }
    ],
    completed: true,
    createdAt: '2026-10-15'
  },
  {
    id: 'CORE-790',
    title: 'Research OAuth2 PKCE spec for native mobile clients',
    summary: 'Establish security architecture document for proof-key code exchange in React Native app.',
    stage: 'Backlog',
    isBlocked: false,
    priority: 'Medium',
    assignee: 'David K.',
    assigneeAvatar: INITIAL_TEAM[1].avatar,
    dueDate: 'Nov 02',
    cluster: 'Security Core',
    points: 3,
    tags: ['Auth', 'Mobile', 'PKCE'],
    commentsCount: 5,
    subtasks: [
      { text: 'RFC 7636 review', completed: true },
      { text: 'Draft token storage threat model', completed: false }
    ],
    completed: false,
    createdAt: '2026-10-22'
  },
  {
    id: 'UI-204',
    title: 'Design empty state illustrations & skeleton loaders',
    summary: 'Create high-contrast animated shimmer loaders and interactive empty states for analytics widgets.',
    stage: 'Backlog',
    isBlocked: false,
    priority: 'Low',
    assignee: 'Marcus V.',
    assigneeAvatar: INITIAL_TEAM[3].avatar,
    dueDate: 'Nov 05',
    cluster: 'Design System',
    points: 2,
    tags: ['Design', 'UI', 'Accessibility'],
    commentsCount: 1,
    subtasks: [
      { text: 'Wireframe 4 empty state vectors', completed: true },
      { text: 'Accessible ARIA live regions test', completed: false }
    ],
    completed: false,
    createdAt: '2026-10-22'
  },
  {
    id: 'OPS-109',
    title: 'Kubernetes Horizontal Pod Autoscaler tuning on EU cluster',
    summary: 'Adjust target CPU utilization threshold from 80% to 65% with 3-minute stabilization windows.',
    stage: 'In Progress',
    isBlocked: false,
    priority: 'Urgent',
    assignee: 'Elena R.',
    assigneeAvatar: INITIAL_TEAM[2].avatar,
    dueDate: 'Oct 26',
    cluster: 'Platform Infra',
    points: 8,
    tags: ['K8s', 'DevOps', 'Scaling'],
    commentsCount: 7,
    subtasks: [
      { text: 'Bench test traffic spike recovery', completed: true },
      { text: 'Apply Helm chart revision 4.12', completed: true },
      { text: 'Verify replica cold boot memory spikes', completed: false }
    ],
    completed: false,
    createdAt: '2026-10-21'
  },
  {
    id: 'API-412',
    title: 'GraphQL Subscription gateway multiplexing under load',
    summary: 'Prevent socket exhaustion by bundling pipeline state push frames into a single payload buffer.',
    stage: 'Completed',
    isBlocked: false,
    priority: 'Medium',
    assignee: 'Chloe T.',
    assigneeAvatar: INITIAL_TEAM[4].avatar,
    dueDate: 'Yesterday',
    cluster: 'Edge Platform',
    points: 5,
    tags: ['GraphQL', 'WebSockets', 'Gateway'],
    commentsCount: 9,
    subtasks: [
      { text: 'Socket pool limit audit', completed: true },
      { text: 'Frame coalescing micro-benchmark', completed: true },
      { text: 'Release to staging edge proxies', completed: true }
    ],
    completed: true,
    createdAt: '2026-10-16'
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    user: 'David K.',
    action: 'flagged as blocked',
    target: '#CORE-819 SAML 2.0 Migration',
    time: '8 minutes ago',
    avatar: INITIAL_TEAM[1].avatar,
    type: 'alert'
  },
  {
    id: 'act-2',
    user: 'Elena R.',
    action: 'passed 3/4 integration checks on',
    target: '#INFRA-402 Read Replica Failover',
    time: '24 minutes ago',
    avatar: INITIAL_TEAM[2].avatar,
    type: 'success'
  },
  {
    id: 'act-3',
    user: 'Chloe T.',
    action: 'pushed commit to',
    target: '#PERF-88 Cloudflare Cache Worker',
    time: '1 hour ago',
    avatar: INITIAL_TEAM[4].avatar,
    type: 'commit'
  },
  {
    id: 'act-4',
    user: 'Alex Morgan',
    action: 'approved SOC2 Batch 1 sign-off for',
    target: '#SEC-512 External Auditor Vault',
    time: '3 hours ago',
    avatar: INITIAL_TEAM[0].avatar,
    type: 'check'
  }
];
