import { redirect } from 'next/navigation';

/**
 * 옛 e교회행정 허브 주소.
 *
 * 2026-10-09: 공지사항·자료실·신청 서식·시설 예약을 GNB `교회소개 > 헌금 · 행정`에 **바로 펼쳐서** 허브 단계가 없어졌다
 * (사용자 지시 — 뎁스 최소화, `lib/nav.ts`). 주소로 들어오는 경우를 위해 첫 항목인 공지사항으로 보낸다.
 */
export default function ChurchAdminPage() {
  redirect('/church-admin/notice');
}
