import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { cn } from "@/lib/utils";
import { Shield, FileText, Lock, Scale, Building2, ChevronDown } from "lucide-react";

const sections = [
  { id: "about", label: "Giới thiệu XanhStay", icon: Building2 },
  { id: "terms-xanhid", label: "Chính sách quyền riêng tư", icon: FileText },
  { id: "privacy-xanhid", label: "Bảo mật XanhID", icon: Lock },
  { id: "terms-xanhstay", label: "Điều khoản XanhStay", icon: Shield },
  { id: "complaint", label: "Giải quyết khiếu nại", icon: Scale },
];

const AboutSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Giới thiệu về XanhStay</h2>

    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Thông tin chung</h3>
        <div className="bg-muted/50 rounded-lg p-5 space-y-2 text-sm text-foreground">
          <p>
            <span className="font-medium">Tên công ty:</span> CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL
          </p>
          <p className="text-muted-foreground italic">(GSL DIGITAL SOLUTIONS JOINT STOCK COMPANY)</p>
          <p>
            <span className="font-medium">Mã số thuế:</span> 0111320005
          </p>
          <p>
            <span className="font-medium">Địa chỉ:</span> Tầng 3, 105 Láng Hạ, Quận Đống Đa, TP Hà Nội, Việt Nam
          </p>
          <p className="text-muted-foreground italic">(Floor 3, No.105 Lang Ha, Dong Da District, Ha Noi, Vietnam)</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Thông tin liên hệ</h3>
        <div className="bg-muted/50 rounded-lg p-5 space-y-2 text-sm text-foreground">
          <p>
            <span className="font-medium">Số điện thoại:</span> 0982677588
          </p>
          <p>
            <span className="font-medium">Email:</span> xanhstay@gslgroup.vn
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TermsXanhIDSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">CHÍNH SÁCH QUYỀN RIÊNG TƯ (PRIVACY POLICY) – XANHSTAY</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Ứng dụng: <span className="font-medium">XanhStay</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Đơn vị chủ quản: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL</span>
      </p>
      <p className="text-sm text-muted-foreground">Cập nhật lần cuối: Ngày 23 tháng 03 năm 2026</p>
      <p className="text-muted-foreground mt-3">
        Chào mừng bạn đến với XanhStay. Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Chính sách
        này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng ứng dụng XanhStay và dịch vụ
        XanhID.
      </p>
    </div>

    <Article title="1. Thông tin đơn vị thu thập dữ liệu">
      <ul className="space-y-2">
        <li>
          Tên công ty: <strong>CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL</strong>
        </li>
        <li>
          Mã số thuế: <strong>0111320005</strong>
        </li>
        <li>Địa chỉ: Tầng 3, 105 Láng Hạ, Phường Đống Đa, TP Hà Nội, Việt Nam.</li>
        <li>
          Email liên hệ: <strong>xanhstay@gslgroup.vn</strong>
        </li>
      </ul>
    </Article>

    <Article title="2. Dữ liệu chúng tôi thu thập">
      <p className="mb-2">
        Để cung cấp dịch vụ đặt phòng và quản lý homestay tốt nhất, chúng tôi thu thập các nhóm dữ liệu sau:
      </p>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong>Thông tin định danh:</strong> Họ và tên, số điện thoại, địa chỉ email, ID tài khoản XanhID.
        </li>
        <li>
          <strong>Thông tin vị trí:</strong> Chúng tôi thu thập vị trí của bạn (khi được cho phép) để hiển thị các
          homestay gần nhất và hỗ trợ dẫn đường.
        </li>
        <li>
          <strong>Thông tin hình ảnh:</strong> Truy cập thư viện ảnh hoặc camera khi bạn tải lên ảnh đại diện hoặc ảnh
          đánh giá dịch vụ.
        </li>
        <li>
          <strong>Thông tin thiết bị:</strong> Loại máy, hệ điều hành, địa chỉ IP và nhật ký (log) để đảm bảo an toàn hệ
          thống.
        </li>
        <li>
          <strong>Xác thực bên thứ ba:</strong> Nếu bạn đăng nhập qua Google, Facebook hoặc Apple, chúng tôi nhận thông
          tin định danh cơ bản từ các nền tảng này.
        </li>
      </ul>
    </Article>

    <Article title="3. Mục đích sử dụng dữ liệu">
      <ul className="space-y-2 list-disc list-inside">
        <li>Cung cấp dịch vụ đặt phòng, thanh toán và quản lý lưu trú tại XanhStay.</li>
        <li>Xác thực danh tính người dùng thông qua hệ thống XanhID.</li>
        <li>Gửi thông báo xác nhận đặt phòng, khuyến mại hoặc cảnh báo bảo mật.</li>
        <li>Cải thiện trải nghiệm người dùng và khắc phục lỗi kỹ thuật.</li>
        <li>Tuân thủ các nghĩa vụ pháp lý theo quy định của pháp luật Việt Nam.</li>
      </ul>
    </Article>

    <Article title="4. Chia sẻ và Bảo mật dữ liệu">
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong>Không bán dữ liệu:</strong> Chúng tôi tuyệt đối không bán hoặc chia sẻ dữ liệu cá nhân của bạn cho bên
          thứ ba vì mục đích quảng cáo.
        </li>
        <li>
          <strong>Đối tác dịch vụ:</strong> Dữ liệu chỉ được chia sẻ với các đối tác thanh toán hoặc đơn vị lưu trú nhằm
          hoàn tất giao dịch đặt phòng.
        </li>
        <li>
          <strong>Bảo mật:</strong> Chúng tôi sử dụng các biện pháp mã hóa tiên tiến và hệ thống máy chủ bảo mật để ngăn
          chặn truy cập trái phép.
        </li>
      </ul>
    </Article>

    <Article title="5. Quyền của người dùng và Xóa dữ liệu (Quan trọng)">
      <p className="mb-2">Bạn có đầy đủ các quyền đối với dữ liệu cá nhân của mình:</p>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong>Truy cập và chỉnh sửa:</strong> Bạn có thể tự cập nhật thông tin trong phần "Hồ sơ" của ứng dụng.
        </li>
        <li>
          <strong>Yêu cầu xóa dữ liệu:</strong> Bạn có quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên
          quan.
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
            <li>
              <strong>Cách 1:</strong> Sử dụng tính năng "Xóa tài khoản" ngay trong mục Cài đặt ứng dụng XanhStay.
            </li>
            <li>
              <strong>Cách 2:</strong> Gửi yêu cầu qua email: <strong>xanhstay@gslgroup.vn</strong>. Chúng tôi sẽ xử lý
              và xóa toàn bộ dữ liệu định danh của bạn trong vòng 07 ngày làm việc.
            </li>
          </ul>
        </li>
      </ul>
    </Article>

    <Article title="6. Dữ liệu trẻ em">
      <p>
        XanhStay không chủ đích thu thập dữ liệu của trẻ em dưới 13 tuổi. Nếu phát hiện có sự thu thập ngoài ý muốn,
        chúng tôi sẽ tiến hành xóa bỏ ngay lập tức.
      </p>
    </Article>

    <Article title="7. Thay đổi chính sách">
      <p>
        Chúng tôi có thể cập nhật chính sách này để phù hợp với sự thay đổi của pháp luật hoặc tính năng ứng dụng. Mọi
        thay đổi sẽ được thông báo trực tiếp trên ứng dụng.
      </p>
    </Article>
  </div>
);

const PrivacyXanhIDSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Chính sách bảo mật XanhID</h2>
      <p className="text-sm text-muted-foreground mt-1">Áp dụng cho Google Play Console và Apple App Store.</p>
      <p className="text-sm text-muted-foreground">
        Đơn vị cung cấp dịch vụ: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL.</span>
      </p>
    </div>

    <Article title="Điều 1. Mục đích và phạm vi">
      <ol className="list-decimal list-inside space-y-2">
        <li>
          Chính sách này quy định cách thức Xanh ID thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của người dùng.
        </li>
        <li>
          Việc cài đặt, đăng ký hoặc sử dụng ứng dụng Xanh ID đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với Chính
          sách bảo mật này.
        </li>
      </ol>
    </Article>

    <Article title="Điều 2. Loại dữ liệu thu thập">
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Thông tin định danh:</strong> Họ tên, email, số điện thoại, ID tài khoản.
        </li>
        <li>
          <strong>Thông tin kỹ thuật:</strong> Thiết bị, hệ điều hành, địa chỉ IP, log truy cập.
        </li>
        <li>
          <strong>Thông tin đăng nhập bên thứ ba</strong> (Facebook, Google, Apple) chỉ dùng cho mục đích xác thực.
        </li>
      </ol>
    </Article>

    <Article title="Điều 3. Mục đích sử dụng dữ liệu">
      <ol className="list-decimal list-inside space-y-2">
        <li>Tạo và quản lý tài khoản Xanh ID.</li>
        <li>Xác thực danh tính và hỗ trợ đăng nhập.</li>
        <li>Cải thiện chất lượng dịch vụ, bảo mật hệ thống.</li>
        <li>Tuân thủ yêu cầu pháp lý từ cơ quan nhà nước có thẩm quyền.</li>
      </ol>
    </Article>

    <Article title="Điều 4. Chia sẻ dữ liệu">
      <ol className="list-decimal list-inside space-y-2">
        <li>Xanh ID không bán hoặc trao đổi dữ liệu cá nhân cho bên thứ ba.</li>
        <li>
          Dữ liệu chỉ được chia sẻ trong các trường hợp:
          <ol className="list-[lower-alpha] list-inside ml-4 mt-1 space-y-1">
            <li>Có sự đồng ý của người dùng.</li>
            <li>Theo yêu cầu của cơ quan nhà nước có thẩm quyền.</li>
            <li>Đối tác kỹ thuật phục vụ vận hành hệ thống trong phạm vi cần thiết.</li>
          </ol>
        </li>
      </ol>
    </Article>

    <Article title="Điều 5. Lưu trữ và bảo mật">
      <ol className="list-decimal list-inside space-y-2">
        <li>Dữ liệu cá nhân được lưu trữ trên hệ thống máy chủ bảo mật.</li>
        <li>Áp dụng các biện pháp kỹ thuật để ngăn chặn truy cập trái phép, mất mát dữ liệu.</li>
        <li>Thời gian lưu trữ dữ liệu phù hợp với mục đích sử dụng hoặc theo quy định pháp luật.</li>
      </ol>
    </Article>

    <Article title="Điều 6. Quyền của người dùng">
      <ol className="list-decimal list-inside space-y-2">
        <li>Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân.</li>
        <li>Rút lại sự đồng ý cho phép xử lý dữ liệu.</li>
        <li>Gửi khiếu nại liên quan đến bảo mật thông tin qua email hỗ trợ.</li>
      </ol>
    </Article>

    <Article title="Điều 7. Dữ liệu trẻ em">
      <ol className="list-decimal list-inside space-y-2">
        <li>Xanh ID không chủ đích thu thập dữ liệu của trẻ em dưới 13 tuổi.</li>
        <li>Nếu phát hiện dữ liệu trẻ em được thu thập trái phép, chúng tôi sẽ xóa ngay khi nhận được thông báo.</li>
      </ol>
    </Article>

    <Article title="Điều 8. Thay đổi chính sách">
      <ol className="list-decimal list-inside space-y-2">
        <li>Chính sách bảo mật có thể được cập nhật theo yêu cầu pháp lý hoặc thay đổi dịch vụ.</li>
      </ol>
    </Article>

    <Article title="Điều 9. Hiệu lực">
      <p>Chính sách bảo mật này có hiệu lực kể từ ngày người dùng chấp nhận khi sử dụng ứng dụng Xanh ID.</p>
    </Article>
  </div>
);

const TermsXanhStaySection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ XANHID & XANHSTAY</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Đơn vị cung cấp: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL</span>
      </p>
      <p className="text-sm text-muted-foreground">
        MST: <strong>0111320005</strong>
      </p>
      <p className="text-sm text-muted-foreground">
        Áp dụng cho: Toàn bộ người dùng trên Google Play Console và Apple App Store.
      </p>
    </div>

    <Article title="Điều 1. Phạm vi áp dụng và Chấp thuận">
      <p className="mb-2">
        Điều khoản này điều chỉnh việc đăng ký, quản lý và sử dụng hệ thống định danh XanhID trên các ứng dụng thuộc hệ
        sinh thái của GSL, bao gồm nhưng không giới hạn ở ứng dụng XanhStay.
      </p>
      <p>
        Bằng việc tải, cài đặt hoặc nhấn "Đồng ý" khi đăng ký tài khoản, người dùng mặc nhiên xác nhận đã đọc, hiểu và
        đồng ý tuân thủ toàn bộ các điều khoản này.
      </p>
    </Article>

    <Article title="Điều 2. Đăng ký và Bảo mật tài khoản">
      <ul className="space-y-2 list-disc list-inside">
        <li>
          Người dùng cam kết cung cấp thông tin chính xác (Họ tên, SĐT, Email). GSL có quyền tạm khóa tài khoản nếu phát
          hiện thông tin giả mạo.
        </li>
        <li>
          Người dùng có trách nhiệm tự bảo mật mật khẩu và thiết bị đăng nhập. Mọi hoạt động phát sinh từ tài khoản của
          người dùng sẽ được tính là trách nhiệm pháp lý của chính người dùng đó.
        </li>
        <li>
          <strong>Quyền chấm dứt dịch vụ:</strong> Người dùng có quyền ngừng sử dụng dịch vụ và yêu cầu xóa tài khoản
          vĩnh viễn bất cứ lúc nào thông qua tính năng "Xóa tài khoản" trong ứng dụng hoặc gửi yêu cầu tới{" "}
          <strong>xanhstay@gslgroup.vn</strong>.
        </li>
      </ul>
    </Article>

    <Article title="Điều 3. Hành vi bị nghiêm cấm">
      <ul className="space-y-2 list-disc list-inside">
        <li>Sử dụng dịch vụ để thực hiện các hành vi lừa đảo, vi phạm pháp luật Việt Nam.</li>
        <li>
          Can thiệp trái phép vào hệ thống kỹ thuật, đảo ngược mã nguồn (reverse engineering) ứng dụng XanhStay/XanhID.
        </li>
        <li>
          Sử dụng tài khoản để phát tán thông tin rác, nội dung vi phạm thuần phong mỹ tục hoặc xâm phạm quyền sở hữu
          trí tuệ của GSL.
        </li>
      </ul>
    </Article>

    <Article title="Điều 4. Quyền và Trách nhiệm của GSL">
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong>Duy trì dịch vụ:</strong> GSL nỗ lực đảm bảo hệ thống vận hành 24/7 nhưng không chịu trách nhiệm cho
          các gián đoạn do sự cố hạ tầng viễn thông hoặc bất khả kháng.
        </li>
        <li>
          <strong>Xử lý vi phạm:</strong> GSL có quyền đơn phương chấm dứt quyền sử dụng của người dùng nếu phát hiện vi
          phạm Điều khoản này mà không cần báo trước.
        </li>
        <li>
          <strong>Sở hữu trí tuệ:</strong> Toàn bộ nội dung, logo, thiết kế trên XanhStay và XanhID thuộc bản quyền của
          Công ty Cổ Phần Giải Pháp Số GSL.
        </li>
      </ul>
    </Article>

    <Article title="Điều 5. Liên kết bên thứ ba (Apple/Google/Facebook)">
      <ul className="space-y-2 list-disc list-inside">
        <li>
          XanhID cho phép đăng nhập qua các nền tảng bên thứ ba. Việc sử dụng các tài khoản này phải tuân thủ cả chính
          sách của bên thứ ba đó.
        </li>
        <li>
          GSL không chịu trách nhiệm về các rủi ro bảo mật phát sinh từ phía nhà cung cấp dịch vụ liên kết (ví dụ: mất
          tài khoản Facebook dẫn đến mất quyền truy cập XanhID).
        </li>
      </ul>
    </Article>

    <Article title="Điều 6. Giải quyết tranh chấp">
      <p>
        Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng. Trường hợp không đạt được thỏa
        thuận, vụ việc sẽ được đưa ra tòa án có thẩm quyền tại Hà Nội để giải quyết theo pháp luật Việt Nam.
      </p>
    </Article>

    <Article title="Điều 7. Hiệu lực và Thay đổi">
      <ul className="space-y-2 list-disc list-inside">
        <li>Điều khoản có hiệu lực kể từ khi người dùng bắt đầu sử dụng dịch vụ.</li>
        <li>
          GSL có quyền cập nhật Điều khoản này để phù hợp với quy định pháp luật hoặc tính năng mới. Phiên bản mới nhất
          sẽ luôn được cập nhật tại mục "Chính sách & Điều khoản" trên ứng dụng.
        </li>
      </ul>
    </Article>
  </div>
);

const ComplaintSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Cơ chế giải quyết khiếu nại, tranh chấp – Xanh ID</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Đơn vị quản lý và vận hành dịch vụ Xanh ID:{" "}
        <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL.</span>
      </p>
    </div>

    <Article title="Điều 1. Nguyên tắc giải quyết khiếu nại, tranh chấp">
      <ol className="list-decimal list-inside space-y-2">
        <li>
          Khi phát sinh khiếu nại hoặc tranh chấp liên quan đến việc sử dụng dịch vụ Xanh ID, Công ty Cổ Phần Giải Pháp
          Số GSL ưu tiên áp dụng biện pháp thương lượng, hòa giải trên tinh thần hợp tác, tôn trọng quyền và lợi ích hợp
          pháp của các bên.
        </li>
        <li>
          Việc giải quyết khiếu nại được thực hiện minh bạch, khách quan, đúng quy định pháp luật Việt Nam hiện hành.
        </li>
      </ol>
    </Article>

    <Article title="Điều 2. Phạm vi trách nhiệm">
      <ol className="list-decimal list-inside space-y-2">
        <li>
          Xanh ID không chịu trách nhiệm về tính chính xác, hợp pháp của nội dung, thông tin do người dùng tự đăng tải
          hoặc cung cấp.
        </li>
        <li>
          Trong phạm vi quyền hạn của mình, Xanh ID sẽ hỗ trợ người dùng xử lý các phản ánh, khiếu nại liên quan đến nội
          dung vi phạm quy định, bao gồm nhưng không giới hạn ở việc ẩn, gỡ bỏ nội dung, cảnh báo hoặc khóa tài khoản vi
          phạm.
        </li>
      </ol>
    </Article>

    <Article title="Điều 3. Quy trình giải quyết khiếu nại, tranh chấp">
      <div className="space-y-4">
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            1
          </span>
          <p>
            <strong>Bước 1:</strong> Người dùng gửi khiếu nại, phản ánh qua email:{" "}
            <a href="mailto:hotroxanhstay@gmail.com" className="text-primary font-medium hover:underline">
              hotroxanhstay@gmail.com
            </a>
            , kèm theo các tài liệu, chứng cứ liên quan (nếu có).
          </p>
        </div>
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            2
          </span>
          <p>
            <strong>Bước 2:</strong> Bộ phận Chăm sóc khách hàng của Xanh ID tiếp nhận, xác minh nội dung khiếu nại. Tùy
            theo tính chất và mức độ, Xanh ID sẽ áp dụng biện pháp hỗ trợ phù hợp nhằm giải quyết tranh chấp.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            3
          </span>
          <p>
            <strong>Bước 3:</strong> Trường hợp khiếu nại, tranh chấp vượt quá thẩm quyền xử lý của Xanh ID, Công ty sẽ
            hướng dẫn người dùng đưa vụ việc tới cơ quan nhà nước có thẩm quyền để giải quyết theo quy định pháp luật.
          </p>
        </div>
      </div>
    </Article>

    <Article title="Điều 4. Thời hạn xử lý">
      <ol className="list-decimal list-inside space-y-2">
        <li>
          Đối với các khiếu nại thuộc phạm vi xử lý của Xanh ID, thời hạn phản hồi và xử lý dự kiến từ 03 (ba) đến 05
          (năm) ngày làm việc kể từ ngày nhận được khiếu nại hợp lệ.
        </li>
        <li>
          Đối với các tranh chấp vượt quá thẩm quyền, thời hạn giải quyết phụ thuộc vào tiến độ xử lý của cơ quan nhà
          nước có thẩm quyền.
        </li>
      </ol>
    </Article>

    <Article title="Điều 5. Hiệu lực">
      <p>
        Cơ chế giải quyết khiếu nại, tranh chấp này có hiệu lực kể từ thời điểm được công bố và áp dụng trong suốt quá
        trình người dùng sử dụng dịch vụ Xanh ID.
      </p>
    </Article>
  </div>
);

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary/20 pl-5">
      <h4 className="font-semibold text-foreground mb-3">{title}</h4>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

const contentMap: Record<string, React.FC> = {
  about: AboutSection,
  "terms-xanhid": TermsXanhIDSection,
  "privacy-xanhid": PrivacyXanhIDSection,
  "terms-xanhstay": TermsXanhStaySection,
  complaint: ComplaintSection,
};

export default function TermsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeSection, setActiveSection] = useState(() => {
    return tabParam && contentMap[tabParam] ? tabParam : "about";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (tabParam && contentMap[tabParam]) {
      setActiveSection(tabParam);
    }
  }, [tabParam]);

  const handleSetSection = (id: string) => {
    setActiveSection(id);
    setSearchParams({ tab: id }, { replace: true });
  };

  const ActiveContent = contentMap[activeSection];
  const activeLabel = sections.find((s) => s.id === activeSection)?.label;

  return (
    <>
      <SEO
        title="Chính sách bảo mật & Điều khoản sử dụng | XanhStay"
        description="Chính sách bảo mật, điều khoản sử dụng dịch vụ XanhStay và XanhID. Đơn vị vận hành: Công ty Cổ Phần Giải Pháp Số GSL."
      />
      <Navbar />

      <div className="min-h-screen bg-background pt-16">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Chính sách & Điều khoản</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Chính sách bảo mật và điều khoản sử dụng dịch vụ của XanhStay & XanhID.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Mobile dropdown */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-2">
                {(() => {
                  const s = sections.find((s) => s.id === activeSection);
                  const Icon = s?.icon;
                  return Icon ? <Icon className="h-4 w-4 text-primary" /> : null;
                })()}
                {activeLabel}
              </span>
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileMenuOpen && "rotate-180")}
              />
            </button>
            {mobileMenuOpen && (
              <div className="mt-1 rounded-lg border border-border bg-card shadow-card overflow-hidden">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        handleSetSection(s.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                        activeSection === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-10">
            {/* Desktop sidebar nav */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <nav className="sticky top-24 space-y-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSetSection(s.id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors text-left",
                        activeSection === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {s.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">
              <div className="bg-card rounded-xl border border-border p-6 md:p-10 shadow-card">
                <ActiveContent />
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
