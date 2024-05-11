import Link from 'next/link'

export const Brand = () => {
  return (
    <Link className="flex z-40 font-semibold text-gray-950 cursor-pointer" href="/">
      Ying<span className="text-blue-600">Starter</span>
    </Link>
  )
}
