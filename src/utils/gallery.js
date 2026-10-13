/**
 * Centralized utility to categorize gallery photos into 3 community wings:
 * - 'Puja'   (Sharadiya Durga Puja)
 * - 'Club'   (Bansdroni Sonali Sangha Club & Sports)
 * - 'Samiti' (Bansdroni Sonali Park Unnayan Samiti RWA)
 */

export function getImageWing(img) {
  if (!img) return 'Puja';

  const wing = (img.wing || '').toLowerCase();
  if (wing === 'club') return 'Club';
  if (wing === 'samiti' || wing === 'samity') return 'Samiti';
  if (wing === 'puja') return 'Puja';

  const prog = (img.program || '').toLowerCase();
  const cat = (img.category || '').toLowerCase();
  const title = (img.title || '').toLowerCase();

  // 1. Unnayan Samiti (Civic & RWA)
  if (
    prog.includes('samiti') ||
    prog.includes('samity') ||
    cat.includes('samiti') ||
    cat.includes('samity') ||
    title.includes('samiti') ||
    title.includes('samity') ||
    title.includes('উন্নয়ন সমিতি') ||
    title.includes('উন্নয়ন পরিষদ') ||
    cat === 'roads' ||
    cat === 'greenery' ||
    cat === 'sanitation' ||
    cat === 'civic' ||
    cat === 'meetings'
  ) {
    return 'Samiti';
  }

  // 2. Sonali Sangha Club (Sports, Culture & Social Work)
  if (
    prog.includes('club') ||
    prog.includes('sports') ||
    prog.includes('social') ||
    prog.includes('cultural') ||
    cat.includes('club') ||
    cat.includes('sports') ||
    cat.includes('blood') ||
    cat.includes('cultural') ||
    title.includes('club') ||
    title.includes('sangha') ||
    title.includes('sports') ||
    title.includes('সোনালী সঙ্ঘ') ||
    title.includes('রক্তদান')
  ) {
    return 'Club';
  }

  // 3. Sharadiya Durga Puja (Default festival wing)
  return 'Puja';
}

export function isPujaImage(img) {
  return getImageWing(img) === 'Puja';
}

export function isClubImage(img) {
  return getImageWing(img) === 'Club';
}

export function isSamitiImage(img) {
  return getImageWing(img) === 'Samiti';
}

