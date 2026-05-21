-- Seed categories
INSERT INTO categories (name, slug, image_url, sort_order, created_at) VALUES
  ('Cement',          'cement',           NULL, 1, NOW()),
  ('TMT Steel',       'tmt-steel',        NULL, 2, NOW()),
  ('Bricks & Blocks', 'bricks-blocks',    NULL, 3, NOW()),
  ('Aggregates',      'aggregates',       NULL, 4, NOW()),
  ('Ready-Mix Concrete', 'rmc',           NULL, 5, NOW()),
  ('Construction Chemicals', 'chemicals', NULL, 6, NOW()),
  ('Tools & Equipment', 'tools',          NULL, 7, NOW()),
  ('Safety Gear',     'safety',           NULL, 8, NOW());

-- Seed products
INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'UltraTech OPC 53 Grade', 'ultratech-opc-53', id, 'UltraTech', '50 kg bag',
       'High-strength Portland cement suitable for RCC structures, beams, and columns.',
       TRUE, 4.7, 124, NOW() FROM categories WHERE slug='cement';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'ACC PPC Cement', 'acc-ppc', id, 'ACC', '50 kg bag',
       'Portland Pozzolana Cement — durable, eco-friendlier blend for general construction.',
       TRUE, 4.5, 88, NOW() FROM categories WHERE slug='cement';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Tata Tiscon TMT 12mm Fe-550D', 'tata-tiscon-12mm', id, 'Tata Tiscon', 'Tonne',
       'High-strength corrosion-resistant TMT bars, ideal for high-rise residential construction.',
       TRUE, 4.8, 156, NOW() FROM categories WHERE slug='tmt-steel';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'JSW Neosteel TMT 16mm', 'jsw-neosteel-16mm', id, 'JSW', 'Tonne',
       'JSW Neosteel premium TMT bars for heavy-load infrastructure projects.',
       TRUE, 4.6, 92, NOW() FROM categories WHERE slug='tmt-steel';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Fly Ash Bricks (Class A)', 'fly-ash-bricks', id, NULL, '1000 nos',
       'Standard-size 9"x4"x3" fly-ash bricks. Light, dimensionally accurate, low water absorption.',
       TRUE, 4.4, 64, NOW() FROM categories WHERE slug='bricks-blocks';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'AAC Blocks 600x200x200', 'aac-blocks-200', id, 'Birla Aerocon', 'Cubic metre',
       'Autoclaved aerated concrete blocks — lightweight, thermal insulation, faster masonry.',
       TRUE, 4.5, 41, NOW() FROM categories WHERE slug='bricks-blocks';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'M-Sand (Manufactured Sand)', 'm-sand', id, NULL, 'Cubic metre',
       'Crushed-stone fine aggregate ideal for plastering and concreting.',
       TRUE, 4.3, 38, NOW() FROM categories WHERE slug='aggregates';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT '20mm Aggregate', 'aggregate-20mm', id, NULL, 'Cubic metre',
       'Coarse crushed stone aggregate (20 mm) for concrete mix.',
       TRUE, 4.4, 27, NOW() FROM categories WHERE slug='aggregates';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'M25 Grade RMC', 'rmc-m25', id, NULL, 'Cubic metre',
       'Ready-mix concrete grade M25 — supplied site-fresh with delivery and pumping.',
       TRUE, 4.6, 71, NOW() FROM categories WHERE slug='rmc';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'M30 Grade RMC', 'rmc-m30', id, NULL, 'Cubic metre',
       'Ready-mix concrete grade M30 for heavily loaded structural elements.',
       TRUE, 4.6, 55, NOW() FROM categories WHERE slug='rmc';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Dr. Fixit Waterproofing', 'dr-fixit-waterproofing', id, 'Dr. Fixit', '20 kg pack',
       'Polymer-modified waterproofing for terraces, balconies, and wet areas.',
       TRUE, 4.5, 33, NOW() FROM categories WHERE slug='chemicals';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Fosroc Construction Chemicals', 'fosroc-admixture', id, 'Fosroc', '20 L can',
       'Concrete admixture for workability and durability in critical pours.',
       TRUE, 4.4, 24, NOW() FROM categories WHERE slug='chemicals';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Concrete Mixer 10/7', 'concrete-mixer-10-7', id, NULL, 'Per day rental',
       'Site mixer (10/7) for small-scale concrete preparation. Includes operator.',
       TRUE, 4.3, 18, NOW() FROM categories WHERE slug='tools';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Surveying Total Station', 'total-station', id, 'Leica', 'Per day rental',
       'Precision total station rental with operator for site surveying.',
       TRUE, 4.7, 22, NOW() FROM categories WHERE slug='tools';

INSERT INTO products (name, slug, category_id, brand, unit, description, is_active, rating, review_count, created_at)
SELECT 'Safety Helmet (ISI)', 'safety-helmet', id, 'Karam', 'Piece',
       'ISI-certified industrial safety helmets — bulk pricing available.',
       TRUE, 4.5, 49, NOW() FROM categories WHERE slug='safety';

-- Seed admin user (email: admin@civilsupplies.in, password: ChangeMe123!)
-- Hash generated with bcrypt strength 12
INSERT INTO admin_users (email, password_hash, full_name, active, created_at)
VALUES ('admin@civilsupplies.in', '$2a$12$Q3o5tH0nP8H3z6N4Q9Yk0eqVMZJ5xSdYK6/jM9C0g5KqDk3M0eYAm', 'Default Admin', TRUE, NOW());

INSERT INTO admin_user_roles (user_id, role)
SELECT id, 'ROLE_ADMIN' FROM admin_users WHERE email='admin@civilsupplies.in';
