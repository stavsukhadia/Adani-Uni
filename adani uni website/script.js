/**
 * ADANI UNIVERSITY (SHANTIGRAM, AHMEDABAD)
 * Modern Light-Theme Interactive Experience
 * Features:
 * 1. Web Audio Synthesizer (Chirps, Chimes, Success Fanfare)
 * 2. Minimalist Custom Cursor with Fluid Spring Physics
 * 3. Interactive Facility Modals & Curriculum Drawers
 * 4. Interactive Campus Hangout & Food Finder ("The Fuel Hub")
 * 5. Interactive CGPA Calculator & Peer Benchmarker
 * 6. "Find Your Ideal Program" 3-Step Card Quiz with Confetti
 * 7. Photo Gallery Lightbox
 */

// ==========================================
// 1. WEB AUDIO SYNTHESIZER
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainLevel = 0.12) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  pop() {
    this.playTone(600, 'sine', 0.06, 0.08);
  }

  chime() {
    this.playTone(880, 'sine', 0.12, 0.1);
    setTimeout(() => this.playTone(1174, 'sine', 0.2, 0.08), 70);
  }

  success() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.1), i * 65);
    });
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. MINIMALIST CUSTOM CURSOR
// ==========================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.2;
  ringY += (mouseY - ringY) * 0.2;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

function initCursorInteractions() {
  const interactiveSelectors = 'a, button, input, select, .facility-card, .program-card, .food-spot-card, .gallery-card, .preset-chip, .quiz-choice-btn, .archetype-tab-btn';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('cursor-hover');
    });
    el.addEventListener('mousedown', () => {
      sfx.pop();
    });
  });
}

// ==========================================
// 3. NAVIGATION & MOBILE DRAWER
// ==========================================
const mobileToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileNavDrawer');
const closeDrawer = document.getElementById('closeMobileDrawer');

mobileToggle?.addEventListener('click', () => {
  mobileDrawer?.classList.add('open');
});

closeDrawer?.addEventListener('click', () => {
  mobileDrawer?.classList.remove('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileDrawer?.classList.remove('open');
  });
});

// Sound Toggle
const soundToggleBtn = document.getElementById('soundToggleBtn');
soundToggleBtn?.addEventListener('click', () => {
  sfx.muted = !sfx.muted;
  soundToggleBtn.innerHTML = sfx.muted ? '🔇' : '🔊';
  soundToggleBtn.title = sfx.muted ? 'Sound Muted' : 'Sound Enabled';
  if (!sfx.muted) sfx.chime();
});

// ==========================================
// 4. STATS COUNTER ANIMATION
// ==========================================
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          let current = 0;
          const step = target / 35;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.innerText = Math.floor(current);
          }, 30);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-strip');
  if (statsSection) observer.observe(statsSection);
}
initStatsCounter();

// ==========================================
// 5. CAMPUS FEATURES & FACILITIES MODAL
// ==========================================
const facilityFilterBtns = document.querySelectorAll('.facility-filter-btn');
const facilityCards = document.querySelectorAll('.facility-card');

facilityFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    facilityFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    facilityCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
    sfx.pop();
  });
});

const facilityModalData = {
  classroom: {
    title: 'Smart Classrooms & Tiered Lecture Theatres',
    category: 'Academic Technology · FEST / FMS',
    image: 'assets/images/real-classroom.jpg',
    specs: ['Air-Conditioned', 'Dual 4K Interactive Panels', 'Hybrid Lecture Recording', 'Tiered Ergonomic Seating'],
    description: 'Designed on Harvard and Stanford executive case-study models, Adani University lecture halls feature high-definition smart touch displays, hybrid lecture-capture cameras for remote learning, motorized acoustic wall treatment, and continuous high-speed campus Wi-Fi.'
  },
  labs: {
    title: 'Advanced Computing & R&D Laboratories',
    category: 'Research & Innovation · FEST / FoS',
    image: 'assets/images/real-hackathon.jpg',
    specs: ['High-End GPU Workstations', 'Cloud Computing Testbeds', 'BEE Electronics Lab', 'Communication Lab'],
    description: 'Specialized computing laboratories hosting high-throughput GPU clusters for Deep Learning, PyTorch, and TensorFlow, alongside dedicated testbeds for Basic Electrical Engineering (BEE) and professional English business communication.'
  },
  library: {
    title: 'Central Library & Global Resource Hub',
    category: 'Knowledge Hub · 50,000+ Resources',
    image: 'assets/images/real-library.jpg',
    specs: ['KOHA LMS Automation', 'IIM Ahmedabad Tie-up', 'IIT Gandhinagar Access', 'DELNET Consortia Access'],
    description: 'Spanning multiple tranquil levels with automated RFID book drop, KOHA integrated library software, quiet individual research cubicles, and institutional cross-lending tie-ups with premier Indian institutes including IIMA, IITGN, and DELNET.'
  },
  auditorium: {
    title: 'State-of-the-Art 300-Seater Auditorium',
    category: 'Conventions & Leadership Summits',
    image: 'assets/images/real-auditorium.jpg',
    specs: ['300 Plush Tiered Seats', 'Acoustic Cove Lighting', '4K Laser Cinema Projection', 'VIP Green Rooms'],
    description: 'The premier convention hall of Shantigram campus, hosting international academic symposiums, Adani CXO leadership sessions, TEDx talks, convocation ceremonies, and national inter-collegiate debates.'
  },
  sports: {
    title: 'Sports Complex & Wellness Arena',
    category: 'Athletics & Physical Fitness',
    image: 'assets/images/real-sports.jpg',
    specs: ['Indoor Badminton Courts', 'Olympic Table Tennis', 'Chess & Carrom Lounge', 'Shantigram Outdoor Grounds'],
    description: 'Encouraging physical agility and team spirit, the indoor sports complex features maple-wood shock-absorbing badminton courts, table tennis arenas, and access to Shantigram township cricket turf and football fields.'
  },
  lawns: {
    title: '115-Acre Shantigram Green Township & Lawns',
    category: 'Eco-Friendly Smart Township',
    image: 'assets/images/real-lawns.jpg',
    specs: ['80% Green Canopy', 'Solar Microgrid Powered', 'Lakeside Walkways', 'Outdoor Discussion Benches'],
    description: 'A serene academic sanctuary situated within Shantigram Township, Near Vaishnodevi Circle, Ahmedabad. Features landscaped lakeside pavilions, solar-powered lighting, and open-air discussion benches for collaborative outdoor studying.'
  }
};

const facilityModal = document.getElementById('facilityModal');
const facilityModalImg = document.getElementById('facilityModalImg');
const facilityModalTitle = document.getElementById('facilityModalTitle');
const facilityModalCategory = document.getElementById('facilityModalCategory');
const facilityModalDesc = document.getElementById('facilityModalDesc');
const facilityModalSpecs = document.getElementById('facilityModalSpecs');
const closeFacilityModal = document.getElementById('closeFacilityModal');

document.querySelectorAll('.open-facility-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const key = btn.getAttribute('data-facility');
    const data = facilityModalData[key];
    if (data && facilityModal) {
      facilityModalImg.src = data.image;
      facilityModalTitle.innerText = data.title;
      facilityModalCategory.innerText = data.category;
      facilityModalDesc.innerText = data.description;
      facilityModalSpecs.innerHTML = data.specs.map(s => `<span class="spec-pill">${s}</span>`).join('');
      facilityModal.classList.add('open');
      sfx.chime();
    }
  });
});

closeFacilityModal?.addEventListener('click', () => {
  facilityModal?.classList.remove('open');
});

// ==========================================
// 6. CAMPUS HANGOUT & FOOD FINDER (INTERACTIVE)
// ==========================================
const foodFilterBtns = document.querySelectorAll('.food-filter-btn');
const foodSpotCards = document.querySelectorAll('.food-spot-card');

foodFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    foodFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-food-type');

    foodSpotCards.forEach(card => {
      const type = card.getAttribute('data-type');
      if (filter === 'all' || type === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
    sfx.pop();
  });
});

// ==========================================
// 7. ACADEMIC PROGRAMS DIRECTORY & SEARCH
// ==========================================
const progFilterBtns = document.querySelectorAll('.prog-filter-btn');
const programCards = document.querySelectorAll('.program-card');
const programSearchInput = document.getElementById('programSearchInput');

function filterProgramCards() {
  const activeBtn = document.querySelector('.prog-filter-btn.active');
  const activeFaculty = activeBtn ? activeBtn.getAttribute('data-faculty') : 'all';
  const searchTerm = (programSearchInput?.value || '').toLowerCase().trim();

  programCards.forEach(card => {
    const faculty = card.getAttribute('data-faculty');
    const title = card.querySelector('.program-title')?.innerText.toLowerCase() || '';
    const desc = card.querySelector('.program-desc')?.innerText.toLowerCase() || '';
    const tags = Array.from(card.querySelectorAll('.program-tech-tag')).map(t => t.innerText.toLowerCase()).join(' ');

    const matchesFaculty = activeFaculty === 'all' || faculty === activeFaculty;
    const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm);

    if (matchesFaculty && matchesSearch) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

progFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    progFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProgramCards();
    sfx.pop();
  });
});

programSearchInput?.addEventListener('input', filterProgramCards);

// Program Curriculum Drawer / Modal
const programModal = document.getElementById('programModal');
const programModalTitle = document.getElementById('programModalTitle');
const programModalBody = document.getElementById('programModalBody');
const closeProgramModal = document.getElementById('closeProgramModal');

const officialCurriculumData = {
  'cse-aiml': {
    faculty: 'FEST (Faculty of Engineering Sciences & Technology)',
    title: 'B.Tech Computer Science & Engineering (AI-ML)',
    duration: '4 Years | Full-Time Undergraduate',
    modules: [
      'Deep Neural Networks, Optimization & PyTorch Architectures',
      'Computer Vision, Pattern Recognition & Object Detection',
      'Natural Language Processing, Transformers & Large Language Models',
      'High-Performance Distributed GPU Computing & Cloud Microservices',
      'Capstone Projects funded by Adani AI & Analytics Labs'
    ],
    careers: 'AI/ML Research Engineer, Deep Learning Scientist, Data Systems Architect, Computer Vision Engineer, Autonomous Systems Developer.'
  },
  'ict': {
    faculty: 'FEST (Faculty of Engineering Sciences & Technology)',
    title: 'B.Tech Information & Communication Technology (ICT)',
    duration: '4 Years | Full-Time Undergraduate',
    modules: [
      'Advanced Computer Networks & 5G/6G Wireless Architecture',
      'Embedded IoT Systems, Microcontrollers & Edge Telemetry',
      'Cloud Architecture, DevOps Pipelines & Cyber Defense Systems',
      'Industrial Automation & Telecommunication Protocols'
    ],
    careers: 'Cloud Systems Architect, Cyber Defense Engineer, Telecom Operations Lead, IoT Solution Specialist.'
  },
  'civil-mba': {
    faculty: 'FEST & FMS Integrated Collaboration',
    title: 'Integrated B.Tech in Civil & Infrastructure Engineering + MBA in Project Management',
    duration: '5 Years | Dual Leadership Degree',
    modules: [
      'Structural Analysis, Seismic Design & Sustainable Green Concrete',
      'Building Information Modeling (BIM), AutoCAD Civil & Primavera P6',
      'Mega-Infrastructure Capital Financing, Risk Modeling & PPP Concessions',
      'EPC (Engineering, Procurement, Construction) Contract Law & Tendering',
      'Hands-on field immersion across Adani Ports, Airports & Expressway mega projects'
    ],
    careers: 'Infrastructure Project Director, Real Estate Development Head, EPC Contract Specialist, Smart Urban Planner.'
  },
  'csam-mtech': {
    faculty: 'FoS (Faculty of Sciences) & FEST',
    title: 'Integrated B.Tech in Computer Science & Applied Mathematics + M.Tech in Cloud Computing',
    duration: '5 Years | Dual Masters Degree',
    modules: [
      'Advanced Linear Algebra, Numerical Optimization & Stochastic Modeling',
      'Multi-Cloud Distributed Systems (AWS, Azure, GCP, Adani Enterprise Cloud)',
      'Kubernetes, Container Orchestration & Hyperscale Cloud Security',
      'Quantitative Computing, Algorithmic Finance & Big Data Engineering'
    ],
    careers: 'Quantitative Analyst, Hyperscale Cloud Architect, Cryptography Specialist, Big Data Systems Lead.'
  },
  'energy-mba': {
    faculty: 'FEST & FMS Integrated Collaboration',
    title: 'Integrated B.Tech in Energy Engineering + MBA in Energy Management',
    duration: '5 Years | Dual Leadership Degree',
    modules: [
      'Solar Photovoltaic, Wind Turbine & Green Hydrogen Energy Systems',
      'Battery Energy Storage Systems (BESS) & Grid Peak-Shaving',
      'Power Purchase Agreements (PPA), Power Trading & Carbon Credits',
      'Direct immersion in Khavda (World’s Largest 30-GW Hybrid Renewable Park)'
    ],
    careers: 'Renewable Energy Asset Manager, Clean Fuel Consultant, Power Trading Specialist, Grid Modernization Lead.'
  },
  'mba-infra': {
    faculty: 'FMS (Faculty of Management Sciences)',
    title: 'MBA in Infrastructure Management',
    duration: '2 Years | Flagship Postgraduate Program',
    modules: [
      'Public-Private Partnership (PPP) Structuring & Infrastructure Financing',
      'Port Economics, Airport Management & Multi-Modal Supply Chain Logistics',
      'ESG Compliance, Sustainability Leadership & Energy Regulatory Affairs',
      '100% Industry CXO Mentorship and Live Corporate Capstone Consultancy'
    ],
    careers: 'Infrastructure Investment Banker, Supply Chain Strategist, Aviation/Port Operations Head, ESG Policy Consultant.'
  },
  'mtech-cem': {
    faculty: 'FEST (Faculty of Engineering Sciences & Technology)',
    title: 'M.Tech Construction Engineering & Management',
    duration: '2 Years | Postgraduate Specialization',
    modules: [
      'Advanced Structural Health Monitoring & Non-Destructive Testing',
      'Lean Construction, Prefabrication & Construction Automation',
      'Contract Claims, International FIDIC Arbitration & Global Bidding',
      'Applied R&D with Adani Infrastructure Construction Division'
    ],
    careers: 'Chief Construction Engineer, Quality & Safety Auditor, Senior Contracts Consultant, Site Project Director.'
  },
  'dds-phd': {
    faculty: 'DDS (Department of Doctoral Studies)',
    title: 'Doctoral Studies (Ph.D. Programs)',
    duration: '3 to 5 Years | Full-Time & Sponsored Research',
    modules: [
      'Advanced Research Methodology & High-Performance Scientific Writing',
      'Interdisciplinary research spanning FEST, FMS, and Faculty of Sciences',
      'Full institutional access to Adani group industrial testbeds and R&D grants',
      'Sponsored patent filings and international peer-reviewed publications'
    ],
    careers: 'University Professor, Principal Scientist, Corporate R&D Director, Chief Policy Analyst.'
  }
};

document.querySelectorAll('.open-curriculum-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-program');
    const data = officialCurriculumData[key];
    if (data && programModal) {
      programModalTitle.innerText = data.title;
      programModalBody.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span class="program-faculty-badge" style="margin-bottom: 0.65rem; display: inline-block;">${data.faculty}</span>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${data.duration}</div>
          <h4 style="color:var(--brand-primary); margin-bottom: 0.75rem; font-size:1.1rem;">Core Modules & Curriculum Highlights:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.55rem;">
            ${data.modules.map(m => `<li style="display:flex; align-items:flex-start; gap:0.6rem; color:var(--text-secondary); font-size:0.92rem;"><span style="color:var(--brand-blue-accent); font-weight:bold;">▹</span> ${m}</li>`).join('')}
          </ul>
        </div>
        <div style="background-color: var(--bg-surface); border:1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.25rem;">
          <h5 style="color:var(--brand-gold); font-size:0.88rem; margin-bottom: 0.35rem; font-weight:700;">Career Pathways & Placements:</h5>
          <p style="color:var(--text-primary); font-size:0.88rem; line-height:1.5;">${data.careers}</p>
        </div>
      `;
      programModal.classList.add('open');
      sfx.chime();
    }
  });
});

closeProgramModal?.addEventListener('click', () => {
  programModal?.classList.remove('open');
});

// Close modals on backdrop click or ESC
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    document.getElementById('lightboxModal')?.classList.remove('open');
  }
});

// ==========================================
// 8. INTERACTIVE CGPA CALCULATOR & PEER BENCHMARKER
// ==========================================
const gradePointsMap = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};

const coursesTbody = document.getElementById('coursesTbody');
const addCourseBtn = document.getElementById('addCourseBtn');
const cgpaGaugeText = document.getElementById('cgpaGaugeText');
const cgpaFillCircle = document.getElementById('cgpaFillCircle');
const totalCreditsDisplay = document.getElementById('totalCreditsDisplay');
const totalPointsDisplay = document.getElementById('totalPointsDisplay');
const academicHonorBadge = document.getElementById('academicHonorBadge');

function calculateCGPA() {
  const rows = coursesTbody?.querySelectorAll('tr') || [];
  let totalCredits = 0;
  let totalPoints = 0;

  rows.forEach(row => {
    const credits = parseFloat(row.querySelector('.clean-select-credits').value) || 0;
    const grade = row.querySelector('.clean-select-grade').value;
    const points = gradePointsMap[grade] !== undefined ? gradePointsMap[grade] : 0;

    totalCredits += credits;
    totalPoints += (credits * points);
  });

  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const formattedCGPA = cgpa.toFixed(2);

  if (cgpaGaugeText) cgpaGaugeText.innerText = formattedCGPA;
  if (totalCreditsDisplay) totalCreditsDisplay.innerText = totalCredits;
  if (totalPointsDisplay) totalPointsDisplay.innerText = totalPoints.toFixed(1);

  // Radial stroke update (dasharray 283)
  if (cgpaFillCircle) {
    const circumference = 283;
    const offset = circumference - (cgpa / 10) * circumference;
    cgpaFillCircle.style.strokeDashoffset = offset;
  }

  // Academic Standing Milestones
  if (academicHonorBadge) {
    if (cgpa >= 9.0) {
      academicHonorBadge.innerText = "Dean's Honors (Outstanding) 🌟";
      academicHonorBadge.style.color = "var(--brand-gold)";
      academicHonorBadge.style.backgroundColor = "var(--brand-gold-subtle)";
    } else if (cgpa >= 8.0) {
      academicHonorBadge.innerText = "First Class with Distinction 🎖️";
      academicHonorBadge.style.color = "var(--brand-primary)";
      academicHonorBadge.style.backgroundColor = "var(--brand-blue-subtle)";
    } else if (cgpa >= 7.0) {
      academicHonorBadge.innerText = "First Class Standing 🚀";
      academicHonorBadge.style.color = "#059669";
      academicHonorBadge.style.backgroundColor = "#ECFDF5";
    } else if (cgpa >= 6.0) {
      academicHonorBadge.innerText = "Second Class Standing 👍";
      academicHonorBadge.style.color = "var(--text-secondary)";
      academicHonorBadge.style.backgroundColor = "var(--bg-subtle)";
    } else {
      academicHonorBadge.innerText = "Needs Academic Attention ⚠️";
      academicHonorBadge.style.color = "#DC2626";
      academicHonorBadge.style.backgroundColor = "#FEF2F2";
    }
  }

  updateBenchmarkBars(cgpa);
}

function attachRowListeners(row) {
  row.querySelector('.clean-select-credits')?.addEventListener('change', calculateCGPA);
  row.querySelector('.clean-select-grade')?.addEventListener('change', calculateCGPA);
  row.querySelector('.del-btn')?.addEventListener('click', () => {
    const rows = coursesTbody.querySelectorAll('tr');
    if (rows.length > 1) {
      row.remove();
      calculateCGPA();
      sfx.pop();
    } else {
      alert('You must have at least one course row.');
    }
  });
}

coursesTbody?.querySelectorAll('tr').forEach(attachRowListeners);

addCourseBtn?.addEventListener('click', () => {
  const rowCount = coursesTbody.querySelectorAll('tr').length + 1;
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>
      <input type="text" class="clean-input" value="Elective Course ${rowCount}">
    </td>
    <td>
      <select class="clean-select clean-select-credits">
        <option value="4" selected>4</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
      </select>
    </td>
    <td>
      <select class="clean-select clean-select-grade">
        <option value="O">O (10)</option>
        <option value="A+" selected>A+ (9)</option>
        <option value="A">A (8)</option>
        <option value="B+">B+ (7)</option>
        <option value="B">B (6)</option>
        <option value="C">C (5)</option>
        <option value="P">P (4)</option>
        <option value="F">F (0)</option>
      </select>
    </td>
    <td>
      <button class="del-btn" title="Remove course">✕</button>
    </td>
  `;
  coursesTbody.appendChild(newRow);
  attachRowListeners(newRow);
  calculateCGPA();
  sfx.pop();
});

// Curriculum Presets
const presetsMap = {
  fest: [
    { title: 'Data Structures & Algorithms', credits: 4, grade: 'O' },
    { title: 'Artificial Intelligence & Neural Nets', credits: 4, grade: 'A+' },
    { title: 'Cloud Native Microservices', credits: 3, grade: 'A+' },
    { title: 'Computer Networks & 5G Systems', credits: 3, grade: 'A' },
    { title: 'Professional Communication', credits: 2, grade: 'O' }
  ],
  fms: [
    { title: 'Infrastructure Project Finance & PPP', credits: 4, grade: 'O' },
    { title: 'Port & Airport Management Economics', credits: 4, grade: 'A+' },
    { title: 'Supply Chain Logistics & Tendering', credits: 3, grade: 'A+' },
    { title: 'ESG Compliance & Sustainability Policy', credits: 3, grade: 'O' },
    { title: 'Executive Negotiation & Strategy', credits: 2, grade: 'A' }
  ],
  fos: [
    { title: 'Linear Algebra & Numerical Optimization', credits: 4, grade: 'O' },
    { title: 'Stochastic Calculus & Applied Math', credits: 4, grade: 'A+' },
    { title: 'Distributed Cloud Architecture', credits: 3, grade: 'A+' },
    { title: 'Big Data Engineering & Analytics', credits: 3, grade: 'A' },
    { title: 'Scientific Computing Lab', credits: 2, grade: 'O' }
  ]
};

document.querySelectorAll('.preset-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const key = chip.getAttribute('data-preset');
    const courses = presetsMap[key];
    if (courses && coursesTbody) {
      coursesTbody.innerHTML = '';
      courses.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="text" class="clean-input" value="${c.title}"></td>
          <td>
            <select class="clean-select clean-select-credits">
              <option value="4" ${c.credits === 4 ? 'selected' : ''}>4</option>
              <option value="3" ${c.credits === 3 ? 'selected' : ''}>3</option>
              <option value="2" ${c.credits === 2 ? 'selected' : ''}>2</option>
              <option value="1" ${c.credits === 1 ? 'selected' : ''}>1</option>
            </select>
          </td>
          <td>
            <select class="clean-select clean-select-grade">
              <option value="O" ${c.grade === 'O' ? 'selected' : ''}>O (10)</option>
              <option value="A+" ${c.grade === 'A+' ? 'selected' : ''}>A+ (9)</option>
              <option value="A" ${c.grade === 'A' ? 'selected' : ''}>A (8)</option>
              <option value="B+" ${c.grade === 'B+' ? 'selected' : ''}>B+ (7)</option>
              <option value="B" ${c.grade === 'B' ? 'selected' : ''}>B (6)</option>
              <option value="C" ${c.grade === 'C' ? 'selected' : ''}>C (5)</option>
              <option value="P" ${c.grade === 'P' ? 'selected' : ''}>P (4)</option>
              <option value="F" ${c.grade === 'F' ? 'selected' : ''}>F (0)</option>
            </select>
          </td>
          <td><button class="del-btn" title="Remove course">✕</button></td>
        `;
        coursesTbody.appendChild(row);
        attachRowListeners(row);
      });
      calculateCGPA();
      sfx.chime();
      showToast(`Loaded ${chip.innerText.trim()} curriculum preset!`);
    }
  });
});

// Peer Benchmarker Logic
const archetypes = {
  wizard: {
    name: 'The Code Wizard',
    badge: 'Tech Track · LeetCode 500+',
    cgpaTarget: 9.3,
    projectDepthTarget: 92,
    industryTarget: 85,
    advice: 'To benchmark favorably against The Code Wizard: Aim for "O" grades in algorithms and machine learning, and publish 2 cloud-native projects on GitHub.'
  },
  champ: {
    name: 'The Core Engineering Champ',
    badge: 'Infra & Green Energy Lead',
    cgpaTarget: 8.6,
    projectDepthTarget: 95,
    industryTarget: 90,
    advice: 'The Core Engineering Champ excels in BIM, site analysis, and on-site industrial fieldwork across Adani projects. Boost structural modeling scores and pursue early internships!'
  },
  festhead: {
    name: 'The All-Rounder Fest Head',
    badge: 'Student Council & Leadership',
    cgpaTarget: 8.1,
    projectDepthTarget: 75,
    industryTarget: 95,
    advice: 'The Fest Head balances consistent 8+ academics with active sponsorship, event coordination, and student council leadership.'
  }
};

let activeArchetype = 'wizard';
const archetypeTabBtns = document.querySelectorAll('.archetype-tab-btn');

archetypeTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    archetypeTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeArchetype = btn.getAttribute('data-archetype');
    const cgpa = parseFloat(cgpaGaugeText?.innerText) || 8.5;
    updateBenchmarkBars(cgpa);
    sfx.pop();
  });
});

function updateBenchmarkBars(userCGPA) {
  const arc = archetypes[activeArchetype];
  if (!arc) return;

  const archName = document.getElementById('benchmarkArchName');
  const archBadge = document.getElementById('benchmarkArchBadge');
  const archAdvice = document.getElementById('benchmarkAdviceText');

  if (archName) archName.innerText = arc.name;
  if (archBadge) archBadge.innerText = arc.badge;
  if (archAdvice) archAdvice.innerText = arc.advice;

  // Bar 1: CGPA
  const barCgpaUser = document.getElementById('barCgpaUser');
  const barCgpaTarget = document.getElementById('barCgpaTarget');
  const barCgpaVal = document.getElementById('barCgpaVal');
  if (barCgpaUser) barCgpaUser.style.width = `${Math.min(100, (userCGPA / 10) * 100)}%`;
  if (barCgpaTarget) barCgpaTarget.style.width = `${(arc.cgpaTarget / 10) * 100}%`;
  if (barCgpaVal) barCgpaVal.innerText = `${userCGPA.toFixed(2)} vs ${arc.cgpaTarget}`;

  // Bar 2: Project Depth
  const barProjUser = document.getElementById('barProjUser');
  const barProjTarget = document.getElementById('barProjTarget');
  const barProjVal = document.getElementById('barProjVal');
  const userProj = Math.min(100, Math.round(userCGPA * 9.2));
  if (barProjUser) barProjUser.style.width = `${userProj}%`;
  if (barProjTarget) barProjTarget.style.width = `${arc.projectDepthTarget}%`;
  if (barProjVal) barProjVal.innerText = `${userProj}% vs ${arc.projectDepthTarget}%`;

  // Bar 3: Industry Exposure
  const barIndUser = document.getElementById('barIndUser');
  const barIndTarget = document.getElementById('barIndTarget');
  const barIndVal = document.getElementById('barIndVal');
  const userInd = Math.min(100, Math.round(userCGPA * 8.8));
  if (barIndUser) barIndUser.style.width = `${userInd}%`;
  if (barIndTarget) barIndTarget.style.width = `${arc.industryTarget}%`;
  if (barIndVal) barIndVal.innerText = `${userInd}% vs ${arc.industryTarget}%`;
}

calculateCGPA();

// ==========================================
// 9. "FIND YOUR IDEAL PROGRAM" 3-STEP QUIZ
// ==========================================
const quizQuestions = [
  {
    question: "Which of the following topics sparks your passion the most?",
    options: [
      { text: "Designing deep neural networks, AI vision systems & modern algorithms", match: "cse-aiml" },
      { text: "Building next-generation 5G/6G wireless networks & IoT cloud systems", match: "ict" },
      { text: "Leading multi-crore infrastructure projects, smart ports & city planning", match: "civil-mba" },
      { text: "Mastering quantitative mathematics, cloud architecture & cryptography", match: "csam-mtech" },
      { text: "Spearheading green hydrogen, solar microgrids & sustainable energy grids", match: "energy-mba" },
      { text: "Executive project financing, PPP frameworks & global supply chain logistics", match: "mba-infra" }
    ]
  },
  {
    question: "Where do you envision yourself working after graduation?",
    options: [
      { text: "Top-tier AI research labs and global tech giants (Google, IBM, Microsoft)", match: "cse-aiml" },
      { text: "Corporate infrastructure leadership across Adani Ports, Airports & EPC majors", match: "civil-mba" },
      { text: "Renewable energy conglomerates & carbon credit trading houses", match: "energy-mba" },
      { text: "Management consulting firms (KPMG, EY, PwC) advising infrastructure leaders", match: "mba-infra" }
    ]
  },
  {
    question: "What is your primary academic goal?",
    options: [
      { text: "Hands-on software development with high-end GPU workstations", match: "cse-aiml" },
      { text: "Saving 1 full year with a fast-track 5-Year Integrated Dual Degree (B.Tech + MBA)", match: "civil-mba" },
      { text: "Pioneering the national clean energy transition with practical field exposure", match: "energy-mba" },
      { text: "Stepping directly into an executive CXO leadership track in infrastructure", match: "mba-infra" }
    ]
  }
];

let currentQuizStep = 0;
const quizTally = {
  'cse-aiml': 0,
  'ict': 0,
  'civil-mba': 0,
  'csam-mtech': 0,
  'energy-mba': 0,
  'mba-infra': 0
};

const quizStepBox = document.getElementById('quizStepBox');
const quizQNum = document.getElementById('quizQNum');
const quizQTitle = document.getElementById('quizQTitle');
const quizChoicesList = document.getElementById('quizChoicesList');
const quizPills = document.querySelectorAll('.quiz-pill');
const quizResultPanel = document.getElementById('quizResultPanel');
const resultDegreeTitle = document.getElementById('resultDegreeTitle');
const resultDegreeDesc = document.getElementById('resultDegreeDesc');
const resultFacultyName = document.getElementById('resultFacultyName');
const resultAvgPkg = document.getElementById('resultAvgPkg');
const restartQuizBtn = document.getElementById('restartQuizBtn');

function renderQuizStep() {
  const q = quizQuestions[currentQuizStep];
  if (!q) return;

  if (quizQNum) quizQNum.innerText = `Step 0${currentQuizStep + 1} of 03`;
  if (quizQTitle) quizQTitle.innerText = q.question;

  quizPills.forEach((p, idx) => {
    if (idx <= currentQuizStep) p.classList.add('active');
    else p.classList.remove('active');
  });

  if (quizChoicesList) {
    quizChoicesList.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-choice-btn" data-match="${opt.match}">
        <span class="choice-key">${['A', 'B', 'C', 'D', 'E', 'F'][i]}</span>
        <span>${opt.text}</span>
      </button>
    `).join('');

    quizChoicesList.querySelectorAll('.quiz-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.getAttribute('data-match');
        if (m && quizTally[m] !== undefined) quizTally[m]++;
        sfx.chime();
        currentQuizStep++;
        if (currentQuizStep < quizQuestions.length) {
          renderQuizStep();
        } else {
          showQuizResult();
        }
      });
    });
  }
}

function showQuizResult() {
  if (quizStepBox) quizStepBox.style.display = 'none';
  if (quizResultPanel) quizResultPanel.classList.add('active');

  const sorted = Object.entries(quizTally).sort((a, b) => b[1] - a[1]);
  const bestMatch = sorted[0][0];

  const outcomes = {
    'cse-aiml': {
      title: 'B.Tech Computer Science & Engineering (AI-ML)',
      faculty: 'FEST (Faculty of Engineering Sciences & Technology)',
      avg: '₹8.5 - 15+ LPA',
      desc: 'You have a natural affinity for algorithmic problem solving, artificial intelligence, and software architectures. The B.Tech CSE (AI-ML) program at Adani University equips you with high-performance GPU lab training and corporate recruitment across top tech firms.'
    },
    'ict': {
      title: 'B.Tech Information & Communication Technology (ICT)',
      faculty: 'FEST (Faculty of Engineering Sciences & Technology)',
      avg: '₹7.5 - 14 LPA',
      desc: 'Your profile thrives at the intersection of wireless networks, embedded IoT systems, and cloud infrastructure powering smart city connectivity.'
    },
    'civil-mba': {
      title: 'Integrated B.Tech (Civil & Infra) + MBA (Project Management)',
      faculty: 'FEST & FMS Integrated Collaboration',
      avg: '₹8.0 - 15+ LPA',
      desc: 'You possess the vision to build national physical assets combined with executive business acumen. Save one full year with this integrated dual degree with direct immersion in Adani port and airport mega-projects.'
    },
    'csam-mtech': {
      title: 'Integrated B.Tech (CS & Applied Math) + M.Tech (Cloud Computing)',
      faculty: 'FoS (Faculty of Sciences)',
      avg: '₹8.5 - 15+ LPA',
      desc: 'You bridge the gap between abstract mathematical rigor and hyperscale cloud engineering, ideal for quantitative finance and multi-cloud architectures.'
    },
    'energy-mba': {
      title: 'Integrated B.Tech (Energy Engg) + MBA (Energy Management)',
      faculty: 'FEST & FMS Integrated Collaboration',
      avg: '₹8.0 - 14.5 LPA',
      desc: 'Passionate about clean energy and sustainability, you are engineered to lead India’s green hydrogen and renewable power revolution.'
    },
    'mba-infra': {
      title: 'MBA in Infrastructure Management',
      faculty: 'FMS (Faculty of Management Sciences)',
      avg: '₹8.5 - 15+ LPA',
      desc: 'The flagship management program designed for core economic leadership: PPP models, airport/port management, logistics, and ESG consultancy.'
    }
  };

  const res = outcomes[bestMatch] || outcomes['cse-aiml'];
  if (resultDegreeTitle) resultDegreeTitle.innerText = res.title;
  if (resultDegreeDesc) resultDegreeDesc.innerText = res.desc;
  if (resultFacultyName) resultFacultyName.innerText = res.faculty;
  if (resultAvgPkg) resultAvgPkg.innerText = res.avg;

  sfx.success();
  launchConfetti();
  initCursorInteractions();
}

restartQuizBtn?.addEventListener('click', () => {
  currentQuizStep = 0;
  for (let k in quizTally) quizTally[k] = 0;
  if (quizResultPanel) quizResultPanel.classList.remove('active');
  if (quizStepBox) quizStepBox.style.display = 'block';
  renderQuizStep();
  sfx.pop();
});

renderQuizStep();

// ==========================================
// 10. PHOTO GALLERY LIGHTBOX
// ==========================================
const galleryCards = document.querySelectorAll('.gallery-card');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');

galleryCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const cap = card.querySelector('.gallery-caption h4')?.innerText || 'Campus Photo';
    if (lightboxModal && img) {
      lightboxImg.src = img.src;
      lightboxCaption.innerText = cap;
      lightboxModal.classList.add('open');
      sfx.chime();
    }
  });
});

closeLightbox?.addEventListener('click', () => {
  lightboxModal?.classList.remove('open');
});

// ==========================================
// 11. CONFETTI GENERATOR
// ==========================================
const confettiCanvas = document.getElementById('confettiCanvas');
let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];
let confettiActive = false;

function launchConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiParticles = [];

  const colors = ['#0F2E59', '#1E3A8A', '#2563EB', '#D97706', '#F59E0B', '#10B981'];
  for (let i = 0; i < 140; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6
    });
  }

  confettiActive = true;
  animateConfetti();
  setTimeout(() => { confettiActive = false; }, 4000);
}

function animateConfetti() {
  if (!confettiActive && confettiParticles.length === 0) {
    if (confettiCtx) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    return;
  }

  if (confettiCtx) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p, idx) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();

      if (p.y > confettiCanvas.height) {
        confettiParticles.splice(idx, 1);
      }
    });
  }

  if (confettiActive || confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

// ==========================================
// 12. TOAST UTILITY
// ==========================================
const toastMsg = document.getElementById('toastMsg');
let toastTimer = null;

function showToast(text) {
  if (!toastMsg) return;
  toastMsg.innerText = text;
  toastMsg.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 3500);
}

// Init cursor
initCursorInteractions();

console.log('🏛️ Adani University Crisp Light-Theme Web Application Initialized.');
