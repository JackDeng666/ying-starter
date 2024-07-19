'use client'

import Link from 'next/link'
import { Button } from '@/client/components/ui/button'
import { CopyText } from '@/client/components/ui/copy-text'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/client/components/ui/accordion'

import { FloatingSvg, FolderSvg, NextjsSvg, ProgrammingSvg, ReactSvg, ServerSvg } from '@/client/components/svg'
import { MaxWidthWrapper } from '@/client/components/max-width-wrapper'

export default function Page() {
  const Items = [
    {
      title: '项目管理器',
      desc: '使用nx去管理整个项目代码，让前后端的代码可以进行同构，并且可以通过它去一键启动整个项目。',
      link: 'https://nx.dev/',
      svg: <FolderSvg className="w-full h-40" />
    },
    {
      title: '客户端',
      desc: '客户端可能需要 seo 的功能，所以默认直接使用 nextjs 去构建。',
      link: 'https://nextjs.org/',
      svg: <NextjsSvg className="w-full h-40" />
    },
    {
      title: '后台管理端',
      desc: '后台管理系统大部分页面不需要做 seo，直接使用 React + Vite 去构建的单页面应用。',
      link: 'https://vitejs.dev/',
      svg: <ReactSvg className="w-full h-40" />
    },
    {
      title: '服务端',
      desc: '服务端使用 nestjs 构建，使用它构建 api 比用 nextjs 能够提供更加多开箱即用的功能。',
      link: 'https://nestjs.com/',
      svg: <ServerSvg className="w-full h-40" />
    }
  ]

  return (
    <MaxWidthWrapper className="max-w-screen-2xl">
      <section className="grid grid-cols-1 md:grid-cols-[60%_40%] my-4">
        <div className="text-center md:text-left self-center mb-4">
          <h1 className="text-5xl">
            欢迎使用 <span className="text-primary">YingStarter</span>
          </h1>
          <p className="my-4">
            想使用一套技术栈开发全栈web项目？或许你可以试试 nextjs ，但我认为 nextjs 只适合用来写需要 ssr
            的客户端，使用其写 api 接口缺少很多开箱即用的功能，不如
            nestjs，同时如果后台管理系统也写在ssr框架里也没有直接写单页面项目那么丝滑。既然如此，那我们全都要！
            这是一套web全栈项目的开发模板，包含客户端（nextjs），后台管理端（react +
            vite）和服务端（nestjs）代码，三端均使用 Typescript 进行开发，并用 nx 进行了 monorepo
            化的同构开发，这样前后端均可以使用一些公用逻辑，具体可以点击下方查看 github 仓库。
          </p>

          <Button>
            <Link href="https://github.com/JackDeng666/ying-starter" target="_blank">
              查看 Github
            </Link>
          </Button>
        </div>

        <ProgrammingSvg className="w-full h-auto self-center" />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {Items.map((el, index) => (
          <div
            key={index}
            className="cursor-pointer bg-background p-4 rounded-md hover:shadow-sm flex flex-col items-center gap-4"
            onClick={() => {
              window.open(el.link)
            }}
          >
            <div className="text-xl">{el.title}</div>
            <div>{el.desc}</div>
            {el.svg}
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[60%_40%] my-4">
        <div className="flex flex-col gap-3 mb-4">
          <h1 className="text-4xl text-center md:text-left">快速开始</h1>
          <p>方式一</p>
          <p>
            直接前往【
            <Link href="https://github.com/JackDeng666/ying-starter" target="_blank" className="text-primary">
              ying-starter
            </Link>
            】项目仓库下载项目到本地。
          </p>
          <p>方式二</p>
          <p>
            安装下载工具【
            <Link href="https://github.com/JackDeng666/ying-tools" target="_blank" className="text-primary">
              ying-tools
            </Link>
            】
          </p>
          <CopyText value="npm i ying-tools -g" />
          <p>安装好后，用 ying 执行 crt 命令，后面接上项目名称。</p>
          <CopyText value="ying crt [项目名称]" />
          <p>使用默认用户名，随后选择 ying-starter 项目即可。</p>
          <p>请输入Github用户名 JackDeng666</p>
          <p>请选择仓库 ying-starter</p>
        </div>

        <FloatingSvg className="w-full h-auto self-center" />
      </section>

      <section className="my-20">
        <p className="text-4xl text-center">常见问题</p>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>1.修改了代码移动了文件的时候会经常报错？</AccordionTrigger>
            <AccordionContent>删除根目录下的.nx、tmp文件夹，随后重启即可。</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </MaxWidthWrapper>
  )
}
