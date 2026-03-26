// Vercel Serverless Function: AI뉴스 게시판 API
// GitHub API를 통해 posts/index.json을 직접 업데이트하여 영구 저장
//
// 환경변수 (Vercel 대시보드에서 설정):
//   GITHUB_TOKEN       - GitHub Personal Access Token (repo 권한)
//   AI_NEWS_API_KEY    - API 인증 키 (외부 자동화 호출 시 사용)

const OWNER = 'arken0001';
const REPO = 'arken_homepage';
const FILE_PATH = 'public/ai-news/posts/index.json';
const BRANCH = 'main';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN 환경변수가 설정되지 않았습니다.' });
  }

  // API 키 인증 (브라우저 글쓰기는 Referer 체크, 외부 호출은 API 키)
  const apiKey = req.headers['x-api-key'] || req.query.key;
  const referer = req.headers['referer'] || '';
  const isFromSite = referer.includes('arken.co.kr') || referer.includes('localhost');
  const API_KEY = process.env.AI_NEWS_API_KEY;

  if (!isFromSite && API_KEY && apiKey !== API_KEY) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    if (req.method === 'POST') {
      return await handleCreate(req, res, GITHUB_TOKEN);
    } else if (req.method === 'DELETE') {
      return await handleDelete(req, res, GITHUB_TOKEN);
    } else if (req.method === 'GET') {
      return await handleGet(req, res, GITHUB_TOKEN);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}

// 현재 index.json 가져오기
async function getIndexFile(token) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const resp = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  });
  if (resp.status === 404) {
    return { posts: [], sha: null };
  }
  if (!resp.ok) throw new Error('GitHub API 오류: ' + resp.status);
  const data = await resp.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { posts: JSON.parse(content), sha: data.sha };
}

// index.json 업데이트
async function updateIndexFile(token, posts, sha, message) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const body = {
    message,
    content: Buffer.from(JSON.stringify(posts, null, 2), 'utf-8').toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error('GitHub 커밋 실패: ' + (err.message || resp.status));
  }
  return await resp.json();
}

// POST: 글 등록
async function handleCreate(req, res, token) {
  const { title, body, date } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: '제목과 본문을 입력하세요.' });
  }

  const { posts, sha } = await getIndexFile(token);
  const newPost = {
    date: date || new Date().toISOString().slice(0, 10),
    title,
    body
  };
  posts.unshift(newPost);

  await updateIndexFile(token, posts, sha, `Add: AI뉴스 - ${title}`);
  return res.status(200).json({ success: true, message: '글이 등록되었습니다.' });
}

// DELETE: 글 삭제
async function handleDelete(req, res, token) {
  const { index } = req.body;
  if (index === undefined || index === null) {
    return res.status(400).json({ error: '삭제할 글 인덱스가 필요합니다.' });
  }

  const { posts, sha } = await getIndexFile(token);
  if (index < 0 || index >= posts.length) {
    return res.status(400).json({ error: '잘못된 인덱스입니다.' });
  }

  const removed = posts.splice(index, 1)[0];
  await updateIndexFile(token, posts, sha, `Delete: AI뉴스 - ${removed.title}`);
  return res.status(200).json({ success: true, message: '글이 삭제되었습니다.' });
}

// GET: 글 목록 조회
async function handleGet(req, res, token) {
  const { posts } = await getIndexFile(token);
  return res.status(200).json(posts);
}
