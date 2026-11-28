import type { NewsCategory } from '../api/news'

// 백엔드 뉴스 API를 연결하기 전까지 화면에 보여줄 샘플 데이터
export const sampleNewsCategories: NewsCategory[] = [
  {
    fileName: '사회.mjs',
    articles: [
      {
        title: '[샘플] 수도권 출근길 지하철 혼잡도 개선 대책 발표',
        content: '혼잡 시간대 열차 증편과 배차 간격 조정 방안이 함께 공개됐다.',
        link: 'https://example.com/news/society/1',
        source: '샘플뉴스',
      },
      {
        title: '[샘플] 전국 초미세먼지 농도 오후부터 보통 수준 회복',
        content:
          '대기 정체가 풀리면서 오후에는 대부분 지역에서 공기질이 나아질 전망이다.',
        link: 'https://example.com/news/society/2',
        source: '샘플일보',
      },
    ],
  },
  {
    fileName: 'IT.mjs',
    articles: [
      {
        title: '[샘플] 국내 클라우드 시장, 올해 두 자릿수 성장 전망',
        content:
          'AI 서비스 수요가 늘면서 기업들의 클라우드 전환이 빨라지고 있다.',
        link: 'https://example.com/news/it/1',
        source: '샘플테크',
      },
      {
        title: '[샘플] 개발자 채용 시장, 하반기 AI 엔지니어 수요 증가',
        content:
          '생성형 AI를 서비스에 붙이는 경험을 가진 개발자를 찾는 공고가 늘었다.',
        link: 'https://example.com/news/it/2',
        source: '샘플뉴스',
      },
      {
        title: '[샘플] 반도체 업계, 차세대 메모리 양산 일정 앞당겨',
        content:
          '고대역폭 메모리 수요 증가에 맞춰 생산 라인 증설이 이어지고 있다.',
        link: 'https://example.com/news/it/3',
        source: '샘플경제',
      },
    ],
  },
  {
    fileName: '정치.mjs',
    articles: [
      {
        title: '[샘플] 국회, 내년도 예산안 심사 일정 확정',
        content: '상임위원회별 심사를 거쳐 다음 달 본회의에서 처리할 예정이다.',
        link: 'https://example.com/news/politics/1',
        source: '샘플일보',
      },
    ],
  },
  {
    fileName: '경제.mjs',
    articles: [
      {
        title: '[샘플] 코스피 장 초반 강보합, 반도체 대형주 상승',
        content:
          '외국인 매수세가 이어지며 지수가 이틀 연속 반등을 시도하고 있다.',
        link: 'https://example.com/news/economy/1',
        source: '샘플경제',
      },
      {
        title: '[샘플] 원·달러 환율 소폭 하락 출발',
        content: '미국 금리 동결 기대감이 커지면서 환율이 하락세로 출발했다.',
        link: 'https://example.com/news/economy/2',
        source: '샘플뉴스',
      },
    ],
  },
  {
    fileName: '문화.mjs',
    articles: [
      {
        title: '[샘플] 주말 박스오피스, 국내 애니메이션 1위',
        content: '개봉 첫 주 만에 관객 50만 명을 넘기며 흥행을 이어가고 있다.',
        link: 'https://example.com/news/culture/1',
        source: '샘플일보',
      },
    ],
  },
]
