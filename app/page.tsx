import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  Instagram,
  LineChart,
  Mail,
  MapPin,
  MessageCircle,
  NotebookTabs,
  NotebookText,
  Phone,
  ShoppingBag,
  WalletCards,
  Youtube,
} from "lucide-react";

const services = [
  {
    icon: LineChart,
    title: "경영 진단",
    text: "매출, 비용, 운영 흐름을 함께 살펴보고 개선 우선순위를 찾습니다.",
  },
  {
    icon: WalletCards,
    title: "자금 관리",
    text: "현금 흐름과 자금 계획을 보기 쉽게 정리해 의사결정을 돕습니다.",
  },
  {
    icon: NotebookTabs,
    title: "실행 관리",
    text: "상담에서 끝나지 않고 실행 체크리스트와 후속 관리를 연결합니다.",
  },
];

const officialLinks = [
  {
    name: "소상공인시장진흥공단",
    description: "소상공인 지원사업과 정책 정보를 확인할 수 있습니다.",
    href: "https://www.semas.or.kr/",
    badge: "SEMAS",
  },
  {
    name: "경기도시장상권진흥원",
    description: "경기도 소상공인, 전통시장, 골목상권 지원사업을 안내합니다.",
    href: "https://www.gmr.or.kr/",
    badge: "GMR",
  },
  {
    name: "한국세무사회",
    description: "세무사 정보와 세무 관련 안내를 확인할 수 있습니다.",
    href: "https://www.kacta.or.kr/new_new/kacpta22.asp?MpcVer=Y&pcVer=Y",
    badge: "TAX",
  },
  {
    name: "국세청 홈택스",
    description: "국세 신고, 납부, 증명 발급 등 세무 업무를 처리합니다.",
    href: "https://www.hometax.go.kr/",
    badge: "HTX",
  },
  {
    name: "위택스",
    description: "지방세 신고, 납부, 조회 업무를 처리합니다.",
    href: "https://www.wetax.go.kr/",
    badge: "WTX",
  },
];

const customerActions = [
  {
    icon: Phone,
    label: "전화 걸기",
    text: "010-3332-9114",
    href: "tel:01033329114",
  },
  {
    icon: MessageCircle,
    label: "문자 보내기",
    text: "빠른 상담 요청",
    href: "sms:01033329114",
  },
  {
    icon: Mail,
    label: "이메일 문의",
    text: "graceyun07@gmail.com",
    href: "mailto:graceyun07@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "카카오톡 상담",
    text: "상담 채널 열기",
    href: "https://business.kakao.com/_qkrRX/dashboard",
    external: true,
  },
  {
    icon: MapPin,
    label: "길찾기",
    text: "카카오맵에서 보기",
    href: "https://map.kakao.com/?q=KM%20Consulting",
    external: true,
  },
  {
    icon: Instagram,
    label: "인스타그램",
    text: "@yunstar202403",
    href: "https://www.instagram.com/yunstar202403/",
    external: true,
  },
  {
    icon: Youtube,
    label: "유튜브",
    text: "채널 링크 준비중",
    href: "mailto:graceyun07@gmail.com?subject=%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%A7%81%ED%81%AC%20%EB%AC%B8%EC%9D%98",
  },
  {
    icon: NotebookText,
    label: "네이버 블로그",
    text: "graceyun08",
    href: "https://blog.naver.com/graceyun08",
    external: true,
  },
  {
    icon: CalendarCheck,
    label: "네이버 예약",
    text: "예약 링크 준비중",
    href: "mailto:graceyun07@gmail.com?subject=%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%98%88%EC%95%BD%20%EB%AC%B8%EC%9D%98",
  },
  {
    icon: ShoppingBag,
    label: "구매 링크",
    text: "상품 문의하기",
    href: "mailto:graceyun07@gmail.com?subject=%EC%83%81%ED%92%88%20%EA%B5%AC%EB%A7%A4%20%EB%AC%B8%EC%9D%98",
  },
];

function CustomerActionGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "customerActions compact" : "customerActions"}>
      {customerActions.map((action) => {
        const Icon = action.icon;
        const targetProps = action.external
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {};

        return (
          <a className="customerAction" href={action.href} key={action.label} {...targetProps}>
            <span className="actionIcon">
              <Icon size={21} />
            </span>
            <span>
              <strong>{action.label}</strong>
              <small>{action.text}</small>
            </span>
            {action.external ? <ExternalLink className="actionExternal" size={16} /> : null}
          </a>
        );
      })}
    </div>
  );
}

function getSafeNextPath(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string; next?: string }>;
}) {
  const params = await searchParams;

  if (params?.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(params.code)}&next=${encodeURIComponent(getSafeNextPath(params.next))}`);
  }

  return (
    <main className="home">
      <header className="homeHeader">
        <Link className="brand" href="/">
          <Image className="brandLogo" src="/images/logo-dog.png" alt="" width={34} height={34} />
          <span>KM Consulting</span>
        </Link>
        <nav aria-label="주요 메뉴">
          <a href="#services">서비스</a>
          <a href="#portfolio">포트폴리오</a>
          <a href="#contact">상담 문의</a>
          <a href="https://blog.naver.com/graceyun08" target="_blank" rel="noreferrer noopener">
            블로그
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">KM Consulting</p>
          <h1>작은 사업자의 경영 흐름을 함께 정리합니다</h1>
          <p>
            매출, 비용, 자금, 실행 계획을 보기 쉽게 점검하고 지금 필요한 다음 행동을
            찾을 수 있도록 상담합니다.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#contact">
              상담 문의하기
              <ArrowRight size={18} />
            </a>
            <a className="secondaryButton" href="tel:01033329114">전화 걸기</a>
          </div>
        </div>
        <div className="heroImageWrap">
          <Image
            src="/images/hero-consulting.png"
            alt="상담과 경영 계획을 표현한 이미지"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
        </div>
      </section>

      <section className="serviceBand" id="services">
        <div className="sectionTitle">
          <p className="eyebrow">서비스 구성</p>
          <h2>작은 사업자가 자주 마주치는 문제부터 정리합니다</h2>
        </div>
        <div className="serviceGrid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article className="serviceCard" key={service.title}>
                <Icon size={24} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="portfolioBand" id="portfolio" aria-label="포트폴리오 이미지">
        <div className="sectionTitle portfolioTitle">
          <p className="eyebrow">Useful Links</p>
          <h2>소상공인과 세무 업무에 자주 쓰는 기관을 한곳에 모았습니다</h2>
          <p>지원사업 확인부터 국세와 지방세 업무까지 필요한 공식 사이트로 바로 이동할 수 있습니다.</p>
        </div>
        <div className="portfolioMarquee">
          <div className="portfolioTrack">
            {[...officialLinks, ...officialLinks].map((item, index) => (
              <a
                className="portfolioCard"
                href={item.href}
                key={`${item.href}-${index}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="portfolioBadge">{item.badge}</span>
                <span className="portfolioContent">
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </span>
                <ExternalLink size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contactBand" id="contact">
        <div className="contactIntro">
          <p className="eyebrow">상담 문의</p>
          <h2>상담이 필요할 때 바로 연결됩니다</h2>
          <p>전화, 문자, 이메일, 카카오톡부터 지도와 SNS까지 원하는 방식으로 편하게 문의하세요.</p>
          <CustomerActionGrid />
        </div>
        <ul className="readyList">
          <li><CheckCircle2 size={18} /> 전화와 문자로 빠른 문의</li>
          <li><CheckCircle2 size={18} /> 이메일과 카카오톡 상담 가능</li>
          <li><CheckCircle2 size={18} /> 블로그와 인스타그램에서 소식 확인</li>
        </ul>
      </section>

      <footer className="homeFooter">
        <div>
          <Link className="brand" href="/">
            <Image className="brandLogo" src="/images/logo-dog.png" alt="" width={30} height={30} />
            <span>KM Consulting</span>
          </Link>
          <p>고객의 다음 행동이 쉬워지도록 필요한 연락 창구를 한곳에 모았습니다.</p>
        </div>
        <CustomerActionGrid compact />
      </footer>
    </main>
  );
}
