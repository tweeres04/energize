import { useRouter } from 'next/router'
import Link from 'next/link'
import clsx from 'clsx'

export default function Nav() {
	const router = useRouter()
	const path = router.asPath
	return (
		<ul className="nav nav-pills my-3">
			<li className="nav-item">
				<Link href="/">
					<a
						className={clsx('nav-link', { active: path === '/' })}
						aria-current="page"
					>
						Entry
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link href="/charts">
					<a className={clsx('nav-link', { active: path === '/charts' })}>
						Charts
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link href="/report">
					<a className={clsx('nav-link', { active: path === '/report' })}>
						Report
					</a>
				</Link>
			</li>
		</ul>
	)
}
