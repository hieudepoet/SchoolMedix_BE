import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const functionDeclarations = [
    {
        name: "getAllBlogs",
        description: "Lấy toàn bộ thông tin các bài blog chia sẻ",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getClassByStudentID",
        description: "Lấy thông tin của lớp mà học sinh đang học, trong đó có tên lớp, tên khối, tổng số lượng học sinh",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "Là id của học sinh hoặc là của con của phụ huynh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getHealthRecordOfStudent",
        description: "Lấy toàn bộ thông tin sức khỏe của học sinh trong các đợt khám định kỳ. Sẽ ",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "Là id của học sinh hoặc là của con của phụ huynh." }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getAllCheckupCampaignInfo",
        description: "Lấy toàn bộ thông tin về các đợt khám định kỳ cùng với các danh sách các bệnh khám chuyên khoa của nó. Đừng cố hỏi ID của đợt khám định kỳ mà hãy kiếm cách khác để biết được phụ huynh hay học sinh đang quan tâm đến chiến dịch khám định kỳ nào.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getAllSpecialistExamsInfo",
        description: "Lấy toàn bộ thông tin về các chuyên khoa của nhà trường hiện có để khám.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getFullHealthAndSpecialRecordsOfAStudent",
        description: "Lấy toàn bộ thông tin về các chiến ddịch khám chuyên khoa, khám sức khỏe tổng quát mà học sinh đã tham gia.",
        parameters: {
            type: "object",
            properties: {
                id: { type: "string", description: "Là id của học sinh hoặc là của con của phụ huynh." }
            },
            required: ["id"]
        }
    }
]

const apiMap = {
    getAllBlogs: "/blog",
    getClassByStudentID: "/student/:student_id/class",
    getHealthRecordOfStudent: "/health-record/:student_id",
    getAllCheckupCampaignInfo: "/checkup-campaign",
    getAllSpecialistExamsInfo: "/specialist-exam",
    getFullHealthAndSpecialRecordsOfAStudent: "/student/:id/full-record"

}





const prompt = (current_user_role) => {
    const current_user = current_user_role === "parent" ? "phụ huynh" : "học sinh";
    const xung_ho = current_user_role === "parent" ? "phụ huynh hoặc anh chị" : "bạn";
    return {
        role: "user",
        parts: [{
            text: `
Bạn là trợ lý AI chuyên nghiệp của hệ thống SchoolMedix - nền tảng quản lý y tế học đường hàng đầu. Hãy hỗ trợ người dùng với thái độ lịch sự, kiên nhẫn và thấu hiểu, đặc biệt quan tâm đến tính nhạy cảm của thông tin y tế học sinh.

Người bạn đang nói chuyện là ${current_user}, vì thế cho nên bạn cần hiểu rõ là đang nói chuyện với ai nhé.

NGUYÊN TẮC GIAO TIẾP:
- Luôn chào hỏi lịch sự và xưng hô phù hợp. Hãy xưng là "tôi" với phụ huynh, "mình" với học sinh
- Trả lời rõ ràng, dễ hiểu, tránh thuật ngữ kỹ thuật phức tạp, cực kỳ ngắn gọn
- Kiên nhẫn hướng dẫn từng bước khi cần thiết
- Luôn đảm bảo tính bảo mật thông tin y tế
- Sử dụng tiếng Việt để giao tiếp
- Những câu hỏi ngoài nghiệp vụ xin đừng trả lời
- Tuyệt đối đừng sử dụng icons trong câu trả lời
- Bạn không cần dùng kính ngữ quá nhiều!
- Trả lời tập trung vào câu hỏi, tránh trả lời lan man
- Đừng phản hồi "Tôi hiểu bạn/anh/chị muốn gì" 

Những lưu ý khi thiếu thông tin để gọi api:
- Cần phải truy hỏi các thông tin cần để chạy api. Với trường hợp là:
    + Cần campaign id thì hỏi tên chiến dịch là gì
    + Cần student id thì có thể hỏi tên học sinh này
    + 

KIẾN THỨC VỀ HỆ THỐNG:
Vai trò người dùng:
- Quản trị viên hệ thống (toàn quyền quản lý)
- Y tá nhà trường (thực hiện khám, tiêm, ghi nhận)
- Phụ huynh học sinh (quản lý thông tin con, đăng ký dịch vụ)
- Học sinh (xem thông tin cá nhân)

Các chức năng chính:
1. Tiêm chủng: Chiến dịch tiêm → Đăng ký → Thực hiện → Báo cáo
2. Khám sức khỏe: 
    <<--->>
    1.Admin tạo Checkup Campaign ( có thể chỉnh sửa ) status campaign = DRAFTED, tạo campaigncontainspeexam
    (nếu có )
    2.Admin gửi Register cho tất cả Parent có Student học ở trường  status campaign = PREPARING, tạo Register cho từng Student status register = PENDING, tạo health_record cho từng register status health_record = WAITING, tạo special_exam_record từ campaigncontainspeexam status = CANNOT_ATTACH
    3.Parent nhận Register, Submit Register status register = SUBMITTED , special_exam_record status = WAITING nếu Parent chọn tham gia chuyên khoa
    4.Admin đóng Register status campaign = UPCOMING,  các Register của những phụ huynh nào chưa Submit thì status register = CANCELLED và không Submit được nữa
    4*.Admin sau khi hoàn thành Bước 1 tới đây có thể hủy chiến dịch status campaign, specail_exam_record, health_record status = CANCELLED
    5.Admin khởi động chiến dịch status campaign = ONGOING , Nurse có thể chỉnh sửa báo cáo (update health record cho student) status healthRecord = DONE ,  có thể chỉnh sửa special_exam_record nếu  status của special_exam_record   = WAITING chỉnh sửa xong special_exam_record status = DONE
    6.Admin hoàn thành chiến dịch status campaign = DONE
    <<--->>
3. Gửi thuốc: Gửi đơn → Duyệt → Nhận → Hoàn thành
4. Sức khỏe hàng ngày: Ghi nhận → Theo dõi → Báo cáo
5. Khai báo sức khỏe: Khai báo tiền sử → Quản lý hồ sơ
6. Blog: Chia sẻ thông tin y tế học đường

Khi hỗ trợ sử dụng chức năng:
- Giải thích quy trình từng bước
- Đưa ra ví dụ cụ thể
- Hướng dẫn cách tìm kiếm thông tin
- Khi xử lý thông tin nhạy cảm:
- Xác nhận danh tính người dùng
- Chỉ cung cấp thông tin phù hợp với vai trò
- Nhắc nhở về tính bảo mật

Trước khi trả về phản hồi, bạn cần thông qua bước chỉnh sửa phản hồi để có thể trình bày lên dom html:
- Bạn phải xử lý toàn bộ chuyển về thành các thẻ html để tôi có thể dễ trình bày trên khung chat của tôi
- Bỏ các ký tự dư thừa đi

KHI KẾT THÚC:
- Hỏi thêm nếu cần hỗ trợ gì khác
- Chúc sức khỏe và cảm ơn ${xung_ho} đã sử dụng tính năng
        `
        }]
    }
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


export async function getResponseFromAI(req, res) {
    const { current_user_role, chat_history, new_message, student_info, parent_info } = req.body;

    const request_content = {
        role: "user",
        parts: [
            { text: "Bạn không cần phản hồi lại thông tin học sinh và phụ huynh này đâu, chỉ cần lưu lại là được (không cần chào, không cần phản hồi, không cần thông báo là bạn đã lưu lại thông tin hay gì hết). Thông tin hiện tại của học sinh: " + JSON.stringify(student_info) + "thông tin hiện tại của phụ huynh: " + JSON.stringify(parent_info) },
            { text: "Nhưng bạn phải phản hồi tin này: " + new_message },
        ]
    };

    const result = await model.generateContent({
        contents: [
            prompt(current_user_role),
            ...(chat_history || []),
            request_content
        ],
        tools: [{ functionDeclarations, }]

    });

    const calls = result.response.functionCalls?.() || [];
    console.log(calls);
    if (!calls || calls.length === 0) {
        const reply = await result.response;
        return res.json({ new_contents: [reply.candidates[0].content] });
    }

    const api_response_content = {
        role: "model",
        parts: [
            { text: "API_RESPONSE: " },
        ]
    };

    const responses = await Promise.all(
        calls.map(call =>
            callAPIFromAI(call).then(data => JSON.stringify(data))
        )
    );

    api_response_content.parts[0].text += responses.join("\n");

    const followup = await model.generateContent({
        contents: [
            prompt(current_user_role),
            ...(chat_history || []),
            request_content,
            {
                role: "model",
                parts: [
                    { text: "Sau đây là câu phản hồi lặp lại của tôi: " },
                ]
            },
            api_response_content
        ]
    });

    const apiReply = await followup.response;
    return res.json({ new_contents: [api_response_content, apiReply.candidates[0].content] });
}


async function callAPIFromAI(call) {
    try {
        const { name, args } = call;
        const api = apiMap[name];
        if (!api) throw new Error(`Không tìm thấy API cho function số: ${name}`);

        let finalURL = api;
        for (const key in args) {
            finalURL = finalURL.replace(`:${key}`, encodeURIComponent(args[key]));
        }

        const fullURL = `${process.env.RAILWAY_BE_DEPLOYING_URL}/api${finalURL}`;
        console.log("URL here:", fullURL);

        const res = await axios.get(fullURL);
        return res.data;
    } catch (error) {
        console.error("❌ callAPIFromAI error:", error.message);
        return "Không thể lấy thông tin từ api";
    }
}
