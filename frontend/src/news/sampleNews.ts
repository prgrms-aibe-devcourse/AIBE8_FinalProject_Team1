// 백엔드 뉴스 API를 연결하기 전까지 화면에 보여줄 샘플 데이터

export type NewsArticle = {
  title: string
  summary: string
  press: string
  publishedAt: string
  link: string
}

export type NewsCategory = {
  fileName: string
  label: string
  articles: NewsArticle[]
}

export const sampleNewsCategories: NewsCategory[] = [
  {
    fileName: 'society.ts',
    label: '사회',
    articles: [
      {
        title: '[샘플] 수도권 출근길 지하철 혼잡도 개선 대책 발표',
        summary: '혼잡 시간대 열차 증편과 배차 간격 조정 방안이 함께 공개됐다.',
        press: '샘플뉴스',
        publishedAt: '09:12',
        link: 'https://example.com/news/society/1',
      },
      {
        title: '[샘플] 전국 초미세먼지 농도 오후부터 보통 수준 회복',
        summary:
          '대기 정체가 풀리면서 오후에는 대부분 지역에서 공기질이 나아질 전망이다.',
        press: '샘플일보',
        publishedAt: '08:40',
        link: 'https://example.com/news/society/2',
      },
    ],
  },
  {
    fileName: 'it.ts',
    label: 'IT',
    articles: [
      {
        title: '[샘플] 국내 클라우드 시장, 올해 두 자릿수 성장 전망',
        summary:
          'AI 서비스 수요가 늘면서 기업들의 클라우드 전환이 빨라지고 있다.',
        press: '샘플테크',
        publishedAt: '10:05',
        link: 'https://example.com/news/it/1',
      },
      {
        title: '[샘플] 개발자 채용 시장, 하반기 AI 엔지니어 수요 증가',
        summary:
          '생성형 AI를 서비스에 붙이는 경험을 가진 개발자를 찾는 공고가 늘었다.',
        press: '샘플뉴스',
        publishedAt: '09:30',
        link: 'https://example.com/news/it/2',
      },
      {
        title: '[샘플] 반도체 업계, 차세대 메모리 양산 일정 앞당겨',
        summary:
          '고대역폭 메모리 수요 증가에 맞춰 생산 라인 증설이 이어지고 있다.',
        press: '샘플경제',
        publishedAt: '08:55',
        link: 'https://example.com/news/it/3',
      },
    ],
  },
  {
    fileName: 'politics.ts',
    label: '정치',
    articles: [
      {
        title: '[샘플] 국회, 내년도 예산안 심사 일정 확정',
        summary: '상임위원회별 심사를 거쳐 다음 달 본회의에서 처리할 예정이다.',
        press: '샘플일보',
        publishedAt: '09:48',
        link: 'https://example.com/news/politics/1',
      },
    ],
  },
  {
    fileName: 'economy.ts',
    label: '경제',
    articles: [
      {
        title: '[샘플] 코스피 장 초반 강보합, 반도체 대형주 상승',
        summary:
          '외국인 매수세가 이어지며 지수가 이틀 연속 반등을 시도하고 있다.',
        press: '샘플경제',
        publishedAt: '09:03',
        link: 'https://example.com/news/economy/1',
      },
      {
        title: '[샘플] 원·달러 환율 소폭 하락 출발',
        summary: '미국 금리 동결 기대감이 커지면서 환율이 하락세로 출발했다.',
        press: '샘플뉴스',
        publishedAt: '09:01',
        link: 'https://example.com/news/economy/2',
      },
    ],
  },
  {
    fileName: 'culture.ts',
    label: '문화',
    articles: [
      {
        title: '[샘플] 주말 박스오피스, 국내 애니메이션 1위',
        summary: '개봉 첫 주 만에 관객 50만 명을 넘기며 흥행을 이어가고 있다.',
        press: '샘플일보',
        publishedAt: '08:20',
        link: 'https://example.com/news/culture/1',
      },
    ],
  },
]
