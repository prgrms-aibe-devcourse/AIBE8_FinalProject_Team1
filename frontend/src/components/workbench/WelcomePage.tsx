import { sampleNewsCategories } from '../../news/sampleNews'
import styles from './WelcomePage.module.css'

type WelcomePageProps = {
  onOpenFile: (fileName: string) => void
}

const START_ITEMS = [
  { icon: 'new-file', label: 'New File...' },
  { icon: 'go-to-file', label: 'Open...' },
  { icon: 'source-control', label: 'Clone Git Repository...' },
]

// VSCode 시작 화면 모양. Recent에 카테고리 파일을 보여주고 누르면 연다
export function WelcomePage({ onOpenFile }: WelcomePageProps) {
  return (
    <div className={styles.welcomePage}>
      <h1 className={styles.title}>README</h1>
      <p className={styles.subtitle}>Welcome back</p>

      <div className={styles.columns}>
        <section>
          <h2 className={styles.heading}>Start</h2>
          {START_ITEMS.map((item) => (
            <button key={item.label} type="button" className={styles.link}>
              <i className={`codicon codicon-${item.icon}`} />
              {item.label}
            </button>
          ))}
        </section>

        <section>
          <h2 className={styles.heading}>Recent</h2>
          {sampleNewsCategories.map((category) => (
            <button
              key={category.fileName}
              type="button"
              className={styles.link}
              onClick={() => onOpenFile(category.fileName)}
            >
              {category.fileName}
              <span className={styles.path}>~/news/src</span>
            </button>
          ))}
        </section>
      </div>
    </div>
  )
}
