import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImageIcon,
  Menu,
  MousePointerClick,
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
  ScrollText,
  ShoppingBag,
} from "lucide-react";

const products = [
  { name: "브랜드 진단", price: "180,000원", tag: "상담", image: "/images/logo-dog.png" },
  { name: "자금 흐름표", price: "95,000원", tag: "문서", image: "/images/logo-dog.png" },
  { name: "운영 리포트", price: "220,000원", tag: "분석", image: "/images/logo-compact.svg" },
];

export default function UiLabPage() {
  return (
    <main className="labPage">
      <aside className="sidebar">
        <Link className="labBrand" href="/">
          <Image className="brandLogo" src="/images/logo-dog.png" alt="" width={30} height={30} />
          <span>UI Lab</span>
        </Link>
        <nav aria-label="실습 메뉴">
          <a href="#sidebar"><PanelLeftOpen size={18} /> 사이드바</a>
          <a href="#hamburger"><Menu size={18} /> 햄버거 버튼</a>
          <a href="#products"><ShoppingBag size={18} /> 상품 나열</a>
          <a href="#cards"><ImageIcon size={18} /> 카드 UI</a>
          <a href="#contact"><PhoneCall size={18} /> 전화 걸기</a>
        </nav>
      </aside>

      <div className="labContent">
        <header className="labTopbar">
          <button aria-label="사이드바 접기"><PanelLeftClose size={20} /></button>
          <button aria-label="메뉴 열기"><Menu size={20} /></button>
          <Link href="/">홈으로</Link>
        </header>

        <section className="labHero">
          <div>
            <p className="eyebrow">UI 실습 페이지</p>
            <h1>웹사이트에서 자주 쓰는 UI 구성요소</h1>
            <p>사이드바, 상단바, 버튼, 카드, 상품 배열, 스크롤 영역을 한 화면에서 확인합니다.</p>
          </div>
          <a className="callButton" href="tel:010-1234-5678">
            <PhoneCall size={18} />
            전화 걸기
          </a>
        </section>

        <section className="labSection" id="sidebar">
          <div className="sectionHead">
            <h2>사이드바와 상단바</h2>
            <p>좌측 메뉴와 상단 도구 영역을 분리해 화면 구조를 익힙니다.</p>
          </div>
          <div className="componentRow">
            <button className="toolButton"><PanelLeftOpen size={18} /> 열기</button>
            <button className="toolButton"><PanelLeftClose size={18} /> 접기</button>
            <button className="toolButton" id="hamburger"><Menu size={18} /> 메뉴</button>
          </div>
        </section>

        <section className="labSection">
          <div className="sectionHead">
            <h2>내부 스크롤 영역</h2>
            <p>내용이 길 때 특정 영역만 스크롤되도록 만드는 패턴입니다.</p>
          </div>
          <div className="scrollBox">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="scrollItem" key={index}>
                <ScrollText size={18} />
                <span>실습 항목 {index + 1}: 레이아웃을 유지한 채 내용만 스크롤</span>
              </div>
            ))}
          </div>
        </section>

        <section className="labSection" id="products">
          <div className="sectionHead">
            <h2>상품 가로 나열과 세로 나열</h2>
            <p>같은 데이터를 다른 방향의 목록으로 배치합니다.</p>
          </div>
          <div className="productRail">
            {products.map((product) => (
              <article className="productCard" key={product.name}>
                <div className="productImage">
                  <Image src={product.image} alt="" fill sizes="120px" />
                </div>
                <span>{product.tag}</span>
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </article>
            ))}
          </div>
          <div className="verticalList">
            {products.map((product) => (
              <article className="listItem" key={`${product.name}-list`}>
                <Check size={18} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
                <ChevronRight size={18} />
              </article>
            ))}
          </div>
        </section>

        <section className="labSection" id="cards">
          <div className="sectionHead">
            <h2>카드 UI와 이미지 크게 보기</h2>
            <p>이미지, 설명, 주요 동작을 하나의 카드로 묶습니다.</p>
          </div>
          <article className="featureCard">
            <div className="featureImage">
              <Image src="/images/logo-concept-board.png" alt="로고 콘셉트 보드" fill sizes="(max-width: 900px) 100vw, 44vw" />
            </div>
            <div>
              <p className="eyebrow">Preview</p>
              <h3>브랜드 이미지 미리보기</h3>
              <p>클릭하면 크게 보는 기능을 연결하기 좋은 카드 예시입니다.</p>
              <div className="componentRow">
                <button className="primarySmall"><MousePointerClick size={18} /> 크게 보기</button>
                <a className="toolButton" href="https://example.com" target="_blank" rel="noreferrer">
                  <ExternalLink size={18} /> 외부 링크
                </a>
              </div>
            </div>
          </article>
        </section>

        <footer className="labFooter">
          <span>footer 하단 영역</span>
          <a href="#top" aria-label="상단으로 이동"><ArrowUp size={18} /></a>
          <div className="pager" aria-label="페이지 이동">
            <button aria-label="이전"><ChevronLeft size={18} /></button>
            <button aria-label="다음"><ChevronRight size={18} /></button>
          </div>
        </footer>
      </div>
    </main>
  );
}
