import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { cn } from '@/lib/utils';
import { Shield, FileText, Lock, Scale, Building2, ChevronDown } from 'lucide-react';

const sections = [
  { id: 'about', label: 'Giới thiệu XanhStay', icon: Building2 },
  { id: 'terms-xanhid', label: 'Điều khoản XanhID', icon: FileText },
  { id: 'privacy-xanhid', label: 'Bảo mật XanhID', icon: Lock },
  { id: 'terms-xanhstay', label: 'Điều khoản XanhStay', icon: Shield },
  { id: 'complaint', label: 'Giải quyết khiếu nại', icon: Scale },
];

const AboutSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Giới thiệu về XanhStay</h2>

    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Thông tin chung</h3>
        <div className="bg-muted/50 rounded-lg p-5 space-y-2 text-sm text-foreground">
          <p><span className="font-medium">Tên công ty:</span> CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL</p>
          <p className="text-muted-foreground italic">(GSL DIGITAL SOLUTIONS JOINT STOCK COMPANY)</p>
          <p><span className="font-medium">Mã số thuế:</span> 0111382005</p>
          <p><span className="font-medium">Địa chỉ:</span> Tầng 3, 105 Láng Hạ, Quận Đống Đa, TP Hà Nội, Việt Nam</p>
          <p className="text-muted-foreground italic">(Floor 3, No.105 Lang Ha, Dong Da District, Ha Noi, Vietnam)</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Thông tin liên hệ</h3>
        <div className="bg-muted/50 rounded-lg p-5 space-y-2 text-sm text-foreground">
          <p><span className="font-medium">Số điện thoại:</span> 0982677588</p>
          <p><span className="font-medium">Email:</span> xanhstay@gslgroup.vn</p>
        </div>
      </div>
    </div>
  </div>
);

const TermsXanhIDSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Điều khoản sử dụng XanhID</h2>
      <p className="text-sm text-muted-foreground mt-1">Áp dụng cho Google Play Console và Apple App Store.</p>
      <p className="text-sm text-muted-foreground">Đơn vị cung cấp dịch vụ: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL.</span></p>
    </div>

    <Article title="Điều 1. Phạm vi áp dụng">
      <ol className="list-decimal list-inside space-y-2">
        <li>Điều khoản này điều chỉnh việc đăng ký, quản lý và sử dụng tài khoản Xanh ID trên các nền tảng do Công ty Cổ Phần Giải Pháp Số GSL cung cấp.</li>
        <li>Khi người dùng tải, đăng ký hoặc sử dụng ứng dụng Xanh ID trên Google Play hoặc Apple App Store, người dùng mặc nhiên đồng ý với toàn bộ nội dung Điều khoản này.</li>
      </ol>
    </Article>

    <Article title="Điều 2. Định nghĩa">
      <ol className="list-decimal list-inside space-y-2">
        <li><strong>"Xanh ID"</strong>: là hệ thống định danh tài khoản do Công ty Cổ Phần Giải Pháp Số GSL phát triển và vận hành.</li>
        <li><strong>"Người dùng"</strong>: là cá nhân hoặc tổ chức đăng ký và sử dụng Xanh ID.</li>
      </ol>
    </Article>

    <Article title="Điều 3. Đăng ký và sử dụng tài khoản">
      <ol className="list-decimal list-inside space-y-2">
        <li>Người dùng phải cung cấp thông tin đầy đủ, chính xác và chịu trách nhiệm về tính hợp pháp của thông tin đã đăng ký.</li>
        <li>Mỗi người dùng chỉ được đăng ký và sở hữu một tài khoản Xanh ID, trừ khi có thỏa thuận khác bằng văn bản.</li>
        <li>Người dùng không được sử dụng Xanh ID cho các mục đích vi phạm pháp luật Việt Nam.</li>
      </ol>
    </Article>

    <Article title="Điều 4. Hành vi bị nghiêm cấm">
      <ol className="list-decimal list-inside space-y-2">
        <li>Giả mạo thông tin, xâm phạm quyền và lợi ích hợp pháp của tổ chức, cá nhân khác.</li>
        <li>Phát tán nội dung vi phạm pháp luật, thuần phong mỹ tục, hoặc gây ảnh hưởng đến an ninh quốc gia.</li>
        <li>Can thiệp, phá hoại hệ thống kỹ thuật, phát tán mã độc, tấn công trái phép hệ thống.</li>
        <li>Mua bán, chuyển nhượng tài khoản Xanh ID vì mục đích thương mại.</li>
      </ol>
    </Article>

    <Article title="Điều 5. Quyền và nghĩa vụ của người dùng">
      <ol className="list-decimal list-inside space-y-2">
        <li>Được sử dụng các chức năng hợp pháp của Xanh ID theo đúng Điều khoản này.</li>
        <li>Có trách nhiệm bảo mật thông tin đăng nhập và thông báo kịp thời khi phát hiện truy cập trái phép.</li>
        <li>Chịu hoàn toàn trách nhiệm trước pháp luật về mọi hoạt động phát sinh từ tài khoản của mình.</li>
      </ol>
    </Article>

    <Article title="Điều 6. Quyền và nghĩa vụ của doanh nghiệp">
      <ol className="list-decimal list-inside space-y-2">
        <li>Công ty Cổ Phần Giải Pháp Số GSL có quyền tạm khóa hoặc chấm dứt tài khoản vi phạm Điều khoản sử dụng.</li>
        <li>Cam kết bảo mật thông tin cá nhân người dùng theo quy định pháp luật hiện hành.</li>
        <li>Không chịu trách nhiệm đối với các rủi ro phát sinh do lỗi kỹ thuật, sự cố bất khả kháng.</li>
      </ol>
    </Article>

    <Article title="Điều 7. Liên kết bên thứ ba">
      <ol className="list-decimal list-inside space-y-2">
        <li>Xanh ID có thể cho phép người dùng đăng nhập thông qua tài khoản bên thứ ba như Facebook, Google, Apple.</li>
        <li>Người dùng chấp nhận các rủi ro phát sinh từ việc chia sẻ dữ liệu với bên thứ ba và loại trừ trách nhiệm của doanh nghiệp trong phạm vi pháp luật cho phép.</li>
      </ol>
    </Article>

    <Article title="Điều 8. Hiệu lực">
      <ol className="list-decimal list-inside space-y-2">
        <li>Điều khoản này có hiệu lực kể từ thời điểm người dùng chấp nhận khi đăng ký tài khoản.</li>
        <li>Công ty Cổ Phần Giải Pháp Số GSL có quyền sửa đổi, bổ sung Điều khoản và công bố công khai trên ứng dụng.</li>
      </ol>
    </Article>
  </div>
);

const PrivacyXanhIDSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Chính sách bảo mật XanhID</h2>
      <p className="text-sm text-muted-foreground mt-1">Áp dụng cho Google Play Console và Apple App Store.</p>
      <p className="text-sm text-muted-foreground">Đơn vị cung cấp dịch vụ: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL.</span></p>
    </div>

    <Article title="Điều 1. Mục đích và phạm vi">
      <ol className="list-decimal list-inside space-y-2">
        <li>Chính sách này quy định cách thức Xanh ID thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của người dùng.</li>
        <li>Việc cài đặt, đăng ký hoặc sử dụng ứng dụng Xanh ID đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với Chính sách bảo mật này.</li>
      </ol>
    </Article>

    <Article title="Điều 2. Loại dữ liệu thu thập">
      <ol className="list-decimal list-inside space-y-2">
        <li><strong>Thông tin định danh:</strong> Họ tên, email, số điện thoại, ID tài khoản.</li>
        <li><strong>Thông tin kỹ thuật:</strong> Thiết bị, hệ điều hành, địa chỉ IP, log truy cập.</li>
        <li><strong>Thông tin đăng nhập bên thứ ba</strong> (Facebook, Google, Apple) chỉ dùng cho mục đích xác thực.</li>
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
        <li>Dữ liệu chỉ được chia sẻ trong các trường hợp:
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
      <h2 className="text-2xl font-bold text-foreground">Điều khoản & Cam kết sử dụng dịch vụ XanhStay</h2>
      <p className="text-sm text-muted-foreground mt-1">Đơn vị vận hành: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL.</span></p>
    </div>

    <div className="space-y-2">
      <h3 className="text-lg font-bold text-primary uppercase tracking-wide">I. Điều khoản quy định chung</h3>
    </div>

    <Article title="Điều 1. Trách nhiệm tài khoản">
      <ol className="list-decimal list-inside space-y-2">
        <li>Người đứng tên đăng ký tài khoản XanhStay chịu hoàn toàn trách nhiệm đối với mọi hoạt động phát sinh từ tài khoản do mình sở hữu trên hệ thống.</li>
        <li>XanhStay không chấp nhận bất kỳ nội dung nào vi phạm thuần phong mỹ tục, pháp luật Việt Nam và các quy định của Nhà nước CHXHCN Việt Nam.</li>
      </ol>
    </Article>

    <Article title="Điều 2. Quy định nội dung">
      <ol className="list-decimal list-inside space-y-2">
        <li>Người dùng không được lưu trữ, chia sẻ, phát tán phần mềm hoặc nội dung không rõ nguồn gốc, vi phạm quyền sở hữu trí tuệ.</li>
        <li>XanhStay có quyền chỉnh sửa, ẩn hoặc xóa nội dung không phù hợp với quy định.</li>
        <li>Thông tin cá nhân của người dùng được bảo mật, trừ trường hợp cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.</li>
      </ol>
    </Article>

    <div className="space-y-2 pt-4">
      <h3 className="text-lg font-bold text-primary uppercase tracking-wide">II. Điều khoản chi tiết khi sử dụng dịch vụ XanhStay</h3>
    </div>

    <Article title="Điều 3. Nguyên tắc sử dụng">
      <ol className="list-decimal list-inside space-y-2">
        <li>Người dùng chịu trách nhiệm về toàn bộ thông tin đăng ký và cập nhật tài khoản XanhStay.</li>
        <li>Không sử dụng tên tài khoản vi phạm đạo đức xã hội, giả mạo danh nhân, lãnh đạo, tổ chức phản động, khủng bố.</li>
      </ol>
    </Article>

    <Article title="Điều 4. Hành vi bị nghiêm cấm">
      <ol className="list-decimal list-inside space-y-2">
        <li>Lợi dụng dịch vụ để xâm phạm an ninh quốc gia, trật tự xã hội.</li>
        <li>Đưa thông tin sai sự thật, xúc phạm uy tín, danh dự của tổ chức, cá nhân.</li>
        <li>Phá hoại hệ thống, phát tán mã độc, truy cập trái phép.</li>
        <li>Mua bán tài khoản XanhStay dưới mọi hình thức.</li>
        <li>Tổ chức cá cược, cờ bạc hoặc hoạt động tài chính trái phép.</li>
      </ol>
    </Article>

    <Article title="Điều 5. Đăng ký và đăng nhập">
      <ol className="list-decimal list-inside space-y-2">
        <li>Người dùng xác nhận đã đọc, hiểu và đồng ý toàn bộ Điều khoản này trước khi đăng ký.</li>
        <li>XanhStay cho phép đăng nhập bằng tài khoản liên kết (Facebook, Google, Apple); người dùng tự chịu rủi ro phát sinh.</li>
      </ol>
    </Article>

    <Article title="Điều 6. Mật khẩu và bảo mật">
      <ol className="list-decimal list-inside space-y-2">
        <li>Người dùng có trách nhiệm tự bảo mật thông tin đăng nhập.</li>
        <li>XanhStay không chịu trách nhiệm đối với thiệt hại phát sinh do lộ mật khẩu.</li>
        <li>Tài khoản không hoạt động trong thời gian dài có thể bị thu hồi theo quy định.</li>
      </ol>
    </Article>

    <div className="space-y-2 pt-4">
      <h3 className="text-lg font-bold text-primary uppercase tracking-wide">III. Quyền, trách nhiệm và giới hạn</h3>
    </div>

    <Article title="Điều 7. Quyền của người dùng">
      <ol className="list-decimal list-inside space-y-2">
        <li>Được cập nhật thông tin tài khoản và sử dụng dịch vụ hợp pháp của XanhStay.</li>
        <li>Được hỗ trợ kỹ thuật theo quy định.</li>
      </ol>
    </Article>

    <Article title="Điều 8. Trách nhiệm của người dùng">
      <ol className="list-decimal list-inside space-y-2">
        <li>Cung cấp thông tin trung thực, chính xác.</li>
        <li>Bảo mật thông tin cá nhân và thông báo ngay khi phát hiện truy cập trái phép.</li>
        <li>Tuân thủ pháp luật và Điều khoản này.</li>
      </ol>
    </Article>

    <Article title="Điều 9. Quyền và trách nhiệm của XanhStay">
      <ol className="list-decimal list-inside space-y-2">
        <li>Tạm khóa hoặc chấm dứt tài khoản vi phạm.</li>
        <li>Bảo mật dữ liệu cá nhân theo quy định pháp luật.</li>
        <li>Hỗ trợ, tiếp nhận và giải quyết khiếu nại hợp lệ.</li>
      </ol>
    </Article>

    <div className="space-y-2 pt-4">
      <h3 className="text-lg font-bold text-primary uppercase tracking-wide">IV. Cam kết khách hàng</h3>
    </div>

    <Article title="Điều 10. Cam kết bảo mật thông tin">
      <p>XanhStay cam kết không tiết lộ, mua bán dữ liệu cá nhân của khách hàng cho bên thứ ba, trừ trường hợp có sự đồng ý của khách hàng hoặc theo yêu cầu pháp luật.</p>
    </Article>

    <Article title="Điều 11. Cam kết chất lượng dịch vụ">
      <p>XanhStay cung cấp dịch vụ đúng với mô tả, minh bạch và không gây nhầm lẫn cho người dùng.</p>
    </Article>

    <Article title="Điều 12. Cam kết thái độ phục vụ">
      <p className="mb-2">XanhStay cam kết:</p>
      <ol className="list-decimal list-inside space-y-2">
        <li>Phục vụ khách hàng với thái độ tôn trọng, trung thực và chuyên nghiệp.</li>
        <li>Tiếp nhận và phản hồi kịp thời các ý kiến, khiếu nại.</li>
        <li>Không ngừng cải thiện chất lượng dịch vụ dựa trên phản hồi của khách hàng.</li>
      </ol>
    </Article>

    <Article title="Điều 13. Hiệu lực">
      <p>Điều khoản & Cam kết này có hiệu lực kể từ thời điểm người dùng chấp nhận khi đăng ký hoặc sử dụng dịch vụ XanhStay.</p>
    </Article>
  </div>
);

const ComplaintSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Cơ chế giải quyết khiếu nại, tranh chấp – Xanh ID</h2>
      <p className="text-sm text-muted-foreground mt-1">Đơn vị quản lý và vận hành dịch vụ Xanh ID: <span className="font-medium">CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ GSL.</span></p>
    </div>

    <Article title="Điều 1. Nguyên tắc giải quyết khiếu nại, tranh chấp">
      <ol className="list-decimal list-inside space-y-2">
        <li>Khi phát sinh khiếu nại hoặc tranh chấp liên quan đến việc sử dụng dịch vụ Xanh ID, Công ty Cổ Phần Giải Pháp Số GSL ưu tiên áp dụng biện pháp thương lượng, hòa giải trên tinh thần hợp tác, tôn trọng quyền và lợi ích hợp pháp của các bên.</li>
        <li>Việc giải quyết khiếu nại được thực hiện minh bạch, khách quan, đúng quy định pháp luật Việt Nam hiện hành.</li>
      </ol>
    </Article>

    <Article title="Điều 2. Phạm vi trách nhiệm">
      <ol className="list-decimal list-inside space-y-2">
        <li>Xanh ID không chịu trách nhiệm về tính chính xác, hợp pháp của nội dung, thông tin do người dùng tự đăng tải hoặc cung cấp.</li>
        <li>Trong phạm vi quyền hạn của mình, Xanh ID sẽ hỗ trợ người dùng xử lý các phản ánh, khiếu nại liên quan đến nội dung vi phạm quy định, bao gồm nhưng không giới hạn ở việc ẩn, gỡ bỏ nội dung, cảnh báo hoặc khóa tài khoản vi phạm.</li>
      </ol>
    </Article>

    <Article title="Điều 3. Quy trình giải quyết khiếu nại, tranh chấp">
      <div className="space-y-4">
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
          <p><strong>Bước 1:</strong> Người dùng gửi khiếu nại, phản ánh qua email: <a href="mailto:hotroxanhstay@gmail.com" className="text-primary font-medium hover:underline">hotroxanhstay@gmail.com</a>, kèm theo các tài liệu, chứng cứ liên quan (nếu có).</p>
        </div>
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
          <p><strong>Bước 2:</strong> Bộ phận Chăm sóc khách hàng của Xanh ID tiếp nhận, xác minh nội dung khiếu nại. Tùy theo tính chất và mức độ, Xanh ID sẽ áp dụng biện pháp hỗ trợ phù hợp nhằm giải quyết tranh chấp.</p>
        </div>
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
          <p><strong>Bước 3:</strong> Trường hợp khiếu nại, tranh chấp vượt quá thẩm quyền xử lý của Xanh ID, Công ty sẽ hướng dẫn người dùng đưa vụ việc tới cơ quan nhà nước có thẩm quyền để giải quyết theo quy định pháp luật.</p>
        </div>
      </div>
    </Article>

    <Article title="Điều 4. Thời hạn xử lý">
      <ol className="list-decimal list-inside space-y-2">
        <li>Đối với các khiếu nại thuộc phạm vi xử lý của Xanh ID, thời hạn phản hồi và xử lý dự kiến từ 03 (ba) đến 05 (năm) ngày làm việc kể từ ngày nhận được khiếu nại hợp lệ.</li>
        <li>Đối với các tranh chấp vượt quá thẩm quyền, thời hạn giải quyết phụ thuộc vào tiến độ xử lý của cơ quan nhà nước có thẩm quyền.</li>
      </ol>
    </Article>

    <Article title="Điều 5. Hiệu lực">
      <p>Cơ chế giải quyết khiếu nại, tranh chấp này có hiệu lực kể từ thời điểm được công bố và áp dụng trong suốt quá trình người dùng sử dụng dịch vụ Xanh ID.</p>
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
  'about': AboutSection,
  'terms-xanhid': TermsXanhIDSection,
  'privacy-xanhid': PrivacyXanhIDSection,
  'terms-xanhstay': TermsXanhStaySection,
  'complaint': ComplaintSection,
};

export default function TermsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeSection, setActiveSection] = useState(() => {
    return tabParam && contentMap[tabParam] ? tabParam : 'about';
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
  const activeLabel = sections.find(s => s.id === activeSection)?.label;

  return (
    <>
      <SEO
        title="Chính sách bảo mật & Điều khoản sử dụng | XanhStay"
        description="Chính sách bảo mật, điều khoản sử dụng dịch vụ XanhStay và XanhID. Đơn vị vận hành: Công ty Cổ Phần Giải Pháp Số GSL."
      />
      <Navbar />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Chính sách & Điều khoản
            </h1>
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
                  const s = sections.find(s => s.id === activeSection);
                  const Icon = s?.icon;
                  return Icon ? <Icon className="h-4 w-4 text-primary" /> : null;
                })()}
                {activeLabel}
              </span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileMenuOpen && "rotate-180")} />
            </button>
            {mobileMenuOpen && (
              <div className="mt-1 rounded-lg border border-border bg-card shadow-card overflow-hidden">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { handleSetSection(s.id); setMobileMenuOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                        activeSection === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50"
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
                      onClick={() => setActiveSection(s.id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors text-left",
                        activeSection === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
