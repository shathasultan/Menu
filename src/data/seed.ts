// bt:ec52ad88d4b0903b
import type { Category, DB, Product, Restaurant } from '../types';

function uid(prefix: string): string {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

function mkCats(names: string[]): Category[] {
  return names.map((name, i) => ({
    id: uid('c'),
    code: String.fromCharCode(65 + i),
    name,
    nextSeq: 1,
  }));
}

interface SeedItem {
  cat: string;
  name: string;
  price: number;
  desc?: string;
  available?: boolean;
}

function mkProducts(catRef: Record<string, Category>, items: SeedItem[]): Product[] {
  return items.map((item) => {
    const cat = catRef[item.cat];
    const seq = cat.nextSeq++;
    return {
      id: uid('p'),
      categoryId: cat.id,
      code: cat.code + pad2(seq),
      name: item.name,
      price: item.price,
      description: item.desc ?? '',
      available: item.available !== false,
      order: seq,
    };
  });
}

export function seedDB(): DB {
  const r1cats = mkCats(['مشروبات ساخنة', 'مشروبات باردة', 'حلا']);
  const r1catRef = { hot: r1cats[0], cold: r1cats[1], sweet: r1cats[2] };
  const r1: Restaurant = {
    id: uid('r'),
    slug: 'brew-cafe',
    name: 'Brew Cafe',
    tagline: 'قهوة مختصة وحلا منزلي',
    type: 'مقهى',
    status: 'open',
    location: 'حي النخيل، الرياض',
    hours: '٧ص - ١١م يوميًا',
    contact: '@brewcafe.sa',
    hue: 24,
    description: 'مقهى صغير نحمّص فيه القهوة أسبوعيًا، ونجهّز الحلا طازج كل يوم.',
    categories: r1cats,
    products: mkProducts(r1catRef, [
      { cat: 'hot', name: 'اسبريسو', price: 10, desc: 'شوت مزدوج، تحميص متوسط' },
      { cat: 'hot', name: 'لاتيه', price: 14, desc: 'حليب مبخّر مع شوت اسبريسو' },
      { cat: 'cold', name: 'آيس سبانش لاتيه', price: 18, desc: 'حليب مكثف محلى، بدون سكر إضافي' },
      { cat: 'cold', name: 'أمريكانو مثلج', price: 12 },
      { cat: 'sweet', name: 'تشيز كيك', price: 16, desc: 'قطعة يومية طازجة' },
    ]),
  };

  const r2cats = mkCats(['برجر', 'سناكس', 'مشروبات']);
  const r2catRef = { burger: r2cats[0], snack: r2cats[1], drink: r2cats[2] };
  const r2: Restaurant = {
    id: uid('r'),
    slug: 'burger-house',
    name: 'Burger House',
    tagline: 'برجر بلحم طازج يوميًا',
    type: 'مطعم وجبات سريعة',
    status: 'open',
    location: 'طريق الملك فهد، جدة',
    hours: '١٢م - ١٢ص',
    contact: '@burgerhouse',
    hue: 6,
    description: 'برجر مشوي على الفحم، ونقطّع اللحم طازج كل صباح.',
    categories: r2cats,
    products: mkProducts(r2catRef, [
      { cat: 'burger', name: 'برجر كلاسيك', price: 22, desc: 'لحم، خس، طماطم، صوص البيت' },
      { cat: 'burger', name: 'دبل تشيز', price: 28, desc: 'قطعتان لحم، جبن شيدر مضاعف' },
      { cat: 'snack', name: 'بطاطس', price: 9 },
      { cat: 'snack', name: 'حلقات بصل', price: 11 },
      { cat: 'drink', name: 'بيبسي', price: 6 },
    ]),
  };

  const r3cats = mkCats(['قهوة', 'سناكس خفيف']);
  const r3catRef = { coffee: r3cats[0], snack: r3cats[1] };
  const r3: Restaurant = {
    id: uid('r'),
    slug: 'mango-coffee',
    name: 'Mango Coffee',
    tagline: 'كشك قهوة عند نافذة الطلب',
    type: 'كشك قهوة',
    status: 'open',
    location: 'كورنيش الخبر',
    hours: '٦ص - ٢م',
    contact: '@mangocoffee',
    hue: 130,
    description: 'كشك صغير، طاقم شخصين، وذروة طلبات كل صباح.',
    categories: r3cats,
    products: mkProducts(r3catRef, [
      { cat: 'coffee', name: 'قهوة سعودية', price: 8 },
      { cat: 'coffee', name: 'كرك', price: 7 },
      { cat: 'coffee', name: 'لاتيه مانجو', price: 16, desc: 'نكهة موسمية' },
      { cat: 'snack', name: 'كوكيز', price: 6 },
    ]),
  };

  const r4cats = mkCats(['ساندويتشات', 'مشروبات']);
  const r4catRef = { sandwich: r4cats[0], drink: r4cats[1] };
  const r4: Restaurant = {
    id: uid('r'),
    slug: 'quick-bites',
    name: 'Quick Bites',
    tagline: 'عربة طعام متنقلة',
    type: 'عربة طعام',
    status: 'closed',
    location: 'يتنقل حسب الفعاليات',
    hours: 'حسب الموقع الأسبوعي',
    contact: '@quickbites',
    hue: 266,
    description: 'نتابع مواقعنا الأسبوعية عبر انستغرام.',
    categories: r4cats,
    products: mkProducts(r4catRef, [
      { cat: 'sandwich', name: 'شاورما دجاج', price: 15 },
      { cat: 'sandwich', name: 'فلافل راب', price: 12, available: false },
      { cat: 'drink', name: 'عصير برتقال', price: 9 },
    ]),
  };

  return { restaurants: [r1, r2, r3, r4], favorites: [] };
}
