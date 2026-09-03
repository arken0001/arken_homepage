const RELEASE_API = 'https://api.github.com/repos/arken0001/playground-updates/releases/latest';
const RELEASE_PAGE = 'https://github.com/arken0001/playground-updates/releases/latest';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET 요청만 사용할 수 있습니다.' });
  }

  try {
    const response = await fetch(RELEASE_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ARKEN-Playground-Download',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub Release 조회 실패: ${response.status}`);
    }

    const release = await response.json();
    const installer = (release.assets || []).find((asset) =>
      /^Playground-.*-Setup\.exe$/i.test(asset.name)
    );

    if (!installer) {
      throw new Error('최신 Windows 설치 파일이 없습니다.');
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');

    if (req.query.info === '1') {
      return res.status(200).json({
        version: String(release.tag_name || '').replace(/^v/i, ''),
        fileName: installer.name,
        size: installer.size,
        publishedAt: release.published_at,
      });
    }

    return res.redirect(307, installer.browser_download_url);
  } catch (error) {
    if (req.query.info === '1') {
      return res.status(503).json({ error: '최신 버전 정보를 불러오지 못했습니다.' });
    }
    return res.redirect(307, RELEASE_PAGE);
  }
}
