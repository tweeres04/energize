import { useRouter } from 'next/router'
import Link from 'next/link'
import clsx from 'clsx'
import { useUser } from '@auth0/nextjs-auth0'

export default function Nav() {
	const { isLoading: isLoadingUser } = useUser()
	const router = useRouter()
	const path = router.asPath
	return (
		<div className="row">
			<div className="col">
				<ul className="nav nav-pills my-3">
					<li className="nav-item">
						<Link
							href="/"
							className={clsx('nav-link', { active: path === '/' })}
							aria-current="page"
						>
							Entry
						</Link>
					</li>
					<li className="nav-item">
						<Link
							href="/charts"
							className={clsx('nav-link', { active: path === '/charts' })}
						>
							Charts
						</Link>
					</li>
					<li className="nav-item">
						<Link
							href="/report"
							className={clsx('nav-link', { active: path === '/report' })}
						>
							Report
						</Link>
					</li>
				</ul>
			</div>
			{isLoadingUser ? null : (
				<div className="col-auto my-3">
					<a href={`/api/auth/logout`} className="btn btn-secondary">
						Logout
					</a>
				</div>
			)}
		</div>
	)
}
