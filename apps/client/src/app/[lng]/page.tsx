'use client'

import Link from 'next/link'
import { Button } from '@/client/components/ui/button'
import { CopyText } from '@/client/components/ui/copy-text'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/client/components/ui/accordion'

import { FloatingSvg, FolderSvg, NextjsSvg, ProgrammingSvg, ReactSvg, ServerSvg } from '@/client/components/svg'
import { MaxWidthWrapper } from '@/client/components/max-width-wrapper'
import { useTranslate } from '@/client/i18n/client'

const Items = [
  {
    title: 'projectManager',
    desc: 'projectManagerDesc',
    link: 'https://nx.dev/',
    svg: <FolderSvg className="w-full h-40" />
  },
  {
    title: 'client',
    desc: 'clientDesc',
    link: 'https://nextjs.org/',
    svg: <NextjsSvg className="w-full h-40" />
  },
  {
    title: 'managementEnd',
    desc: 'managementEndDesc',
    link: 'https://vitejs.dev/',
    svg: <ReactSvg className="w-full h-40" />
  },
  {
    title: 'server',
    desc: 'serverEnd',
    link: 'https://nestjs.com/',
    svg: <ServerSvg className="w-full h-40" />
  }
]

const LandingPage = () => {
  const { t } = useTranslate('landing_page')

  return (
    <MaxWidthWrapper className="max-w-screen-2xl">
      <section className="grid grid-cols-1 md:grid-cols-[60%_40%] my-4">
        <div className="text-center md:text-left self-center mb-4">
          <h1 className="text-5xl">
            {t('welcomeToUse')} <span className="text-primary">YingStarter</span>
          </h1>
          <p className="my-4">{t('desc')}</p>

          <Button>
            <Link href="https://github.com/JackDeng666/ying-starter" target="_blank">
              {t('github')}
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
            <div className="text-xl">{t(el.title)}</div>
            <div>{t(el.desc)}</div>
            {el.svg}
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[60%_40%] my-4">
        <div className="flex flex-col gap-3 mb-4">
          <h1 className="text-4xl text-center md:text-left">{t('quickStart')}</h1>
          <p>{t('mode1')}</p>
          <p>
            {t('goDirectlyTo')}【
            <Link href="https://github.com/JackDeng666/ying-starter" target="_blank" className="text-primary">
              ying-starter
            </Link>
            】{t('downloadTheProjectLocally')}
          </p>
          <p>{t('mode2')}</p>
          <p>
            {t('installTheDownloadTools')}【
            <Link href="https://github.com/JackDeng666/ying-tools" target="_blank" className="text-primary">
              ying-tools
            </Link>
            】
          </p>
          <CopyText value="npm i ying-tools -g" />
          <p>{t('toolsDesc1')}</p>
          <CopyText value={`ying crt [${t('projectName')}]`} />
          <p>{t('toolsDesc2')}</p>
          <p>{t('toolsDesc3')}</p>
          <p>{t('toolsDesc4')}</p>
        </div>

        <FloatingSvg className="w-full h-auto self-center" />
      </section>

      <section className="my-20">
        <p className="text-4xl text-center">{t('frequentlyAskedQuestion')}</p>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>{t('question1')}</AccordionTrigger>
            <AccordionContent>{t('answer1')}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </MaxWidthWrapper>
  )
}

export default LandingPage
