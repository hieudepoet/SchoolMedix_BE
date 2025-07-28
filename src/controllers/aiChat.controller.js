import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const functionDeclarations = [
    {
        name: "getAllBlogs",
        description: "Lấy toàn bộ thông tin các bài blog chia sẻ thông tin y tế học đường. Sử dụng khi người dùng hỏi về thông tin y tế, tin tức, bài viết chia sẻ",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getClassByStudentID",
        description: "Lấy thông tin của lớp mà học sinh đang học, bao gồm tên lớp, tên khối, tổng số lượng học sinh. Sử dụng khi người dùng hỏi về lớp học, thông tin lớp, bạn bè cùng lớp",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh hoặc con của phụ huynh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getHealthRecordOfStudent",
        description: "Lấy toàn bộ thông tin sức khỏe của học sinh trong các đợt khám định kỳ. Sử dụng khi người dùng hỏi về kết quả khám sức khỏe, tình trạng sức khỏe, chiều cao cân nặng",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh hoặc con của phụ huynh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getAllCheckupCampaignInfo",
        description: "Lấy toàn bộ thông tin về các đợt khám định kỳ cùng với danh sách các bệnh khám chuyên khoa. Sử dụng khi người dùng hỏi về lịch khám, chiến dịch khám sức khỏe, đăng ký khám",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getAllSpecialistExamsInfo",
        description: "Lấy toàn bộ thông tin về các chuyên khoa của nhà trường hiện có để khám. Sử dụng khi người dùng hỏi về chuyên khoa, loại khám chuyên khoa, bác sĩ chuyên khoa",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getFullHealthAndSpecialRecordsOfAStudent",
        description: "Lấy toàn bộ thông tin về các chiến dịch khám chuyên khoa, khám sức khỏe tổng quát mà học sinh đã tham gia. Sử dụng khi người dùng hỏi về lịch sử khám bệnh, tất cả hồ sơ y tế",
        parameters: {
            type: "object",
            properties: {
                id: { type: "string", description: "ID của học sinh hoặc con của phụ huynh" }
            },
            required: ["id"]
        }
    },
    {
        name: "getStudentProfile",
        description: "Lấy thông tin chi tiết của học sinh bao gồm thông tin cá nhân và thông tin phụ huynh bao gồm cả bố và mẹ. Sử dụng khi người dùng hỏi về thông tin cá nhân, thông tin gia đình, thông tin liên lạc",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getParentProfile",
        description: "Lấy thông tin chi tiết của phụ huynh bao gồm thông tin cá nhân và danh sách con. Sử dụng khi người dùng hỏi về thông tin phụ huynh, danh sách con, thông tin gia đình",
        parameters: {
            type: "object",
            properties: {
                parent_id: { type: "string", description: "ID của phụ huynh" }
            },
            required: ["parent_id"]
        }
    },
    {
        name: "getAllVaccinationCampaigns",
        description: "Lấy toàn bộ thông tin về các chiến dịch tiêm chủng. Sử dụng khi người dùng hỏi về lịch tiêm chủng, chiến dịch tiêm, đăng ký tiêm chủng",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "getVaccinationRecordsOfStudent",
        description: "Lấy lịch sử tiêm chủng của học sinh. Sử dụng khi người dùng hỏi về mũi tiêm đã tiêm, lịch sử tiêm chủng, sổ tiêm chủng",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getDiseaseRecordsOfStudent",
        description: "Lấy thông tin về các bệnh mãn tính và truyền nhiễm của học sinh. Sử dụng khi người dùng hỏi về bệnh tật, tiền sử bệnh, bệnh mãn tính, bệnh truyền nhiễm",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getSendDrugRequestsOfStudent",
        description: "Lấy danh sách các yêu cầu gửi thuốc của học sinh. Sử dụng khi người dùng hỏi về đơn thuốc, gửi thuốc, nhận thuốc, tình trạng đơn thuốc",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getDailyHealthRecordsOfStudent",
        description: "Lấy các sự kiện y tế hàng ngày của học sinh. Sử dụng khi người dùng hỏi về sự cố y tế, tai nạn, bệnh đột xuất, ghi nhận sức khỏe hàng ngày",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getParentDashboardStats",
        description: "Lấy thống kê tổng quan cho phụ huynh về tình hình sức khỏe của con. Sử dụng khi người dùng hỏi về tổng quan sức khỏe, thống kê, báo cáo sức khỏe",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" }
            },
            required: ["student_id"]
        }
    },
    {
        name: "getVaccinationCampaignDetail",
        description: "Lấy thông tin chi tiết của một chiến dịch tiêm chủng cụ thể. Sử dụng khi người dùng hỏi về chi tiết chiến dịch tiêm, thông tin cụ thể về một đợt tiêm",
        parameters: {
            type: "object",
            properties: {
                campaign_id: { type: "string", description: "ID của chiến dịch tiêm chủng" }
            },
            required: ["campaign_id"]
        }
    }
];

const apiMap = {
    getAllBlogs: "/blog",
    getClassByStudentID: "/student/:student_id/class",
    getHealthRecordOfStudent: "/health-record/:student_id",
    getAllCheckupCampaignInfo: "/checkup-campaign",
    getAllSpecialistExamsInfo: "/special-exam",
    getFullHealthAndSpecialRecordsOfAStudent: "/student/:id/full-record",
    getStudentProfile: "/student/:student_id",
    getParentProfile: "/parent/:parent_id",
    getAllVaccinationCampaigns: "/vaccination-campaign",
    getVaccinationRecordsOfStudent: "/student/:student_id/vaccination-record",
    getDiseaseRecordsOfStudent: "/student/:student_id/disease-record",
    getSendDrugRequestsOfStudent: "/student/:student_id/send-drug-request",
    getDailyHealthRecordsOfStudent: "/:student_id/daily-health-record",
    getParentDashboardStats: "/dashboard/:student_id/parent-dashboard",
    getVaccinationCampaignDetail: "/vaccination-campaign/:campaign_id"
};

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
- Luôn chào hỏi lịch sự và xưng hô phù hợp. Tuyệt đối xưng là "tôi" với phụ huynh, "mình" với học sinh
- Trả lời rõ ràng, dễ hiểu, tránh thuật ngữ kỹ thuật phức tạp, cực kỳ ngắn gọn
- Kiên nhẫn hướng dẫn từng bước khi cần thiết
- Luôn đảm bảo tính bảo mật thông tin y tế
- Sử dụng tiếng Việt để giao tiếp
- Những câu hỏi ngoài nghiệp vụ xin đừng trả lời
- Tuyệt đối đừng sử dụng icons trong câu trả lời
- Bạn không cần dùng kính ngữ quá nhiều!
- Trả lời tập trung vào câu hỏi, tránh trả lời lan man
- Đừng phản hồi "Tôi hiểu bạn/anh/chị muốn gì" 
- Tránh trả lời cụt lủn, trống không, hoặc thiếu chủ ngữ vị ngữ.
- Tuyệt đối không nhại lại câu hỏi của người dùng một cách vô nghĩa.
- Tuyệt đối không trả lời trống không, không đầy đủ câu cú, không có chủ ngữ – vị ngữ.
- Không dùng những câu thiếu lịch sự, châm chọc, hay có giọng điệu giống như đùa cợt, kể cả khi người dùng nói đùa.
- Khi không chắc chắn câu hỏi, hãy hỏi lại để xác nhận rõ ý người dùng thay vì đoán bừa.
- Nếu không có thông tin, hãy trả lời từ tốn, lịch sự và đề xuất phương án tiếp theo.
- Bạn không cần chào lại người dùng nếu đã chào nhau rồi

HƯỚNG DẪN SỬ DỤNG API:
Bạn PHẢI gọi API khi người dùng hỏi về:
- Thông tin cá nhân → getStudentProfile/getParentProfile
- Lớp học → getClassByStudentID
- Khám sức khỏe → getHealthRecordOfStudent/getAllCheckupCampaignInfo/getCheckupCampaignDetail
- Tiêm chủng → getVaccinationRecordsOfStudent/getAllVaccinationCampaigns/getVaccinationCampaignDetail
- Bệnh tật → getDiseaseRecordsOfStudent
- Gửi thuốc → getSendDrugRequestsOfStudent
- Sự kiện y tế → getDailyHealthRecordsOfStudent
- Thống kê → getParentDashboardStats
- Blog → getAllBlogs
- Chuyên khoa → getAllSpecialistExamsInfo
- Tổng hợp hồ sơ → getFullHealthAndSpecialRecordsOfAStudent

Những lưu ý khi thiếu thông tin để gọi api:
- Cần phải truy hỏi các thông tin cần để chạy api. Với trường hợp là:
    + Cần campaign id thì hỏi tên chiến dịch là gì
    + Cần student id thì có thể hỏi tên học sinh này
    + Cần parent id thì có thể hỏi tên phụ huynh hoặc email
    + Cần class id thì hỏi tên lớp cụ thể
    + Cần grade id thì hỏi tên khối cụ thể
- LƯU Ý QUAN TRỌNG:
    + Nếu bạn biết chắc API nào phù hợp → Hãy thực hiện gọi API bằng cách sử dụng functionCall tương ứng.
    + Tuyệt đối KHÔNG chỉ nói tên API phù hợp.
    + Nếu thiếu thông tin để gọi API, hãy hỏi lại để lấy thêm thông tin.
    + Nếu người dùng có những câu trả lời như là "check lại", "kiểm tra lại", "tôi không biết đã được cập nhật chưa", hãy check lại giúp tôi với" vân vân thì hãy xử lý lại functionCall


VÍ DỤ CÁCH GỌI API:
- "Tôi muốn xem thông tin lớp của con" → getClassByStudentID
- "Kết quả khám sức khỏe của con thế nào?" → getHealthRecordOfStudent
- "Lịch sử tiêm chủng của con ra sao?" → getVaccinationRecordsOfStudent
- "Con có bệnh gì không?" → getDiseaseRecordsOfStudent
- "Đơn thuốc của con thế nào?" → getSendDrugRequestsOfStudent
- "Thống kê sức khỏe của con?" → getParentDashboardStats
- "Chiến dịch tiêm chủng sắp tới?" → getAllVaccinationCampaigns
- "Lịch khám sức khỏe?" → getAllCheckupCampaignInfo
- "Tôi đang bị bệnh gì thế" → getParentDashboardStats + getHealthRecordOfStudent + getDiseaseRecordsOfStudent + getVaccinationRecordsOfStudent

KIẾN THỨC VỀ HỆ THỐNG:
Vai trò người dùng:
- Quản trị viên hệ thống (toàn quyền quản lý)
- Y tá nhà trường (thực hiện khám, tiêm, ghi nhận)
- Phụ huynh học sinh (quản lý thông tin con, đăng ký dịch vụ)
- Học sinh (xem thông tin cá nhân)

Các chức năng chính:
1. Tiêm chủng: 
   - Admin tạo chiến dịch tiêm chủng với thông tin vaccine, thời gian, địa điểm
   - Gửi đăng ký cho phụ huynh có con đủ điều kiện tham gia
   - Phụ huynh xác nhận đăng ký (ACCEPT/REFUSE)
   - Admin đóng đăng ký và lập danh sách học sinh tham gia
   - Thực hiện tiêm chủng và cập nhật hồ sơ tiêm
   - Hoàn thành chiến dịch và báo cáo kết quả
   

2. Khám sức khỏe: 
   - Admin tạo Checkup Campaign ( có thể chỉnh sửa ) status campaign = DRAFTED, tạo campaigncontainspeexam
    (nếu có )
   - Admin gửi Register cho tất cả Parent có Student học ở trường  status campaign = PREPARING, tạo Register cho từng Student status register = PENDING, tạo health_record cho từng register status health_record = WAITING, tạo special_exam_record từ campaigncontainspeexam status = CANNOT_ATTACH
   - Parent nhận Register, Submit Register status register = SUBMITTED , special_exam_record status = WAITING nếu Parent chọn tham gia chuyên khoa
   - Admin đóng Register status campaign = UPCOMING,  các Register của những phụ huynh nào chưa Submit thì status register = CANCELLED và không Submit được nữa
   - Admin sau khi hoàn thành Bước 1 tới đây có thể hủy chiến dịch status campaign, specail_exam_record, health_record status = CANCELLED
   - Admin khởi động chiến dịch status campaign = ONGOING , Nurse có thể chỉnh sửa báo cáo (update health record cho student) status healthRecord = DONE ,  có thể chỉnh sửa special_exam_record nếu  status của special_exam_record   = WAITING chỉnh sửa xong special_exam_record status = DONE
   - Admin hoàn thành chiến dịch status campaign = DONE

3. Gửi thuốc: 
   - Phụ huynh tạo yêu cầu dặn thuốc với đơn thuốc và thông tin học sinh
   - Y tá/Nurse xem xét và duyệt yêu cầu
   - Nếu được duyệt, y tá chuẩn bị thuốc và thông báo cho phụ huynh
   - Phụ huynh đến giao thuốc cho y tá và y tá sẽ xác nhận là đã nhận thuốc từ phụ huynh
   - Học sinh uống thuốc và y tá báo cáo đã hoàn thành

4. Sức khỏe hàng ngày: 
   - Y tá ghi nhận các sự kiện y tế hàng ngày (tai nạn, bệnh đột xuất, sơ cứu)
   - Theo dõi tình trạng sức khỏe của học sinh qua các sự kiện
   - Tạo báo cáo định kỳ về tình hình sức khỏe học sinh
   - Phụ huynh có thể xem các sự kiện y tế của con

5. Khai báo sức khỏe: 
   - Phụ huynh khai báo tiền sử bệnh của con (bệnh mãn tính, truyền nhiễm)
   - Y tá xem xét và xác nhận thông tin khai báo (ACCEPT/REFUSE)
   - Quản lý hồ sơ bệnh án và cập nhật thông tin khi cần thiết
   - Theo dõi lịch sử bệnh tật của học sinh

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
- Xóa hết đi các ký tự sai cấu trúc code html
- Phải giữ câu trả lời thật sạch không có chữ dư chữ thừa

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
    const temperature = current_user_role === "parent" ? 0.2 : 0.7;

    const request_content = {
        role: "user",
        parts: [
            {
                text:
                    "Bạn không cần phản hồi lại thông tin học sinh và phụ huynh này đâu, chỉ cần lưu lại là được (không cần chào, không cần phản hồi, không cần thông báo là bạn đã lưu lại thông tin hay gì hết). Thông tin hiện tại của học sinh: " +
                    JSON.stringify(student_info) +
                    "thông tin hiện tại của phụ huynh: " +
                    JSON.stringify(parent_info),
            },
            { text: "Nhưng bạn phải phản hồi tin này: " + new_message },
        ],
    };

    const result = await model.generateContent({
        contents: [
            prompt(current_user_role),
            ...(chat_history || []),
            request_content
        ],
        tools: [{ functionDeclarations }],
        generationConfig: {
            candidateCount: 8,
            temperature
        }
    });

    const candidates = result.response.candidates;

    let try_number = 1;
    const chosen = candidates.find(c => {
        console.log("Lần thử thứ: " + try_number++);
        try {
            return hasFunctionCallInArray(c.content.parts);
        } catch {
            return false;
        }
    });

    if (!chosen) {
        console.log(candidates[0].content.parts);
        return res.json({ new_contents: [candidates[0].content] });
    }

    console.log(chosen.content.parts);
    const calls = filterFunctionCallInArray(chosen.content.parts);
    console.log(calls);
    const responses = await Promise.all(
        calls.map(call => {
            console.log(call)
            return callAPIFromAI(call).then(data => JSON.stringify(data))
        })
    );

    const api_response_text = `API_RESPONSE: ĐÂY LÀ KẾT QUẢ TRẢ VỀ TỪ CÁC API. DÙ KẾT QUẢ RA SAO, TÔi SẼ TRẢ LỜI NGƯỜI DÙNG DỰA TRÊN NỘI DUNG NÀY. NẾU BỊ LỖI, HÃY BÁO RÕ LÝ DO. NẾU KHÔNG CÓ DỮ LIỆU, HÃY NÓI RÕ KHÔNG CÓ THÔNG TIN: ${responses.join("\n\n")}`;

    const api_response_content = {
        role: "model",
        parts: [
            { text: api_response_text }
        ]
    }

    console.log(api_response_content.parts[0]);

    const followup = await model.generateContent({
        contents: [
            prompt(current_user_role),
            ...(chat_history || []),
            request_content,
            api_response_content,
            {
                role: "user",
                parts: [
                    {
                        text: "Hãy phản hồi người dùng bằng tiếng Việt dựa trên kết quả API ở trên. Trình bày bằng HTML sạch sẽ. Nếu lỗi thì giải thích lý do. Nếu không có dữ liệu, hãy thông báo không có dữ liệu. Cuối cùng, hỏi thêm xem họ có cần hỗ trợ gì khác không. Bạn đừng trả lời ngay trong API_RESPONSE nhé, hãy trả lời ngay bên dưới đây nè! "
                    }
                ]
            }


        ],
        generationConfig: {
            temperature
        }
    });

    const apiReply = await followup.response;
    return res.json({
        new_contents: [
            api_response_content,
            apiReply.candidates[0].content
        ]
    });
}



async function callAPIFromAI(call) {
    try {
        const { name, args } = call;
        const api = apiMap[name];
        if (!api) throw new Error(`Không tìm thấy API cho function tên: ${name}`);

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

function hasFunctionCallInArray(arr) {
    return Array.isArray(arr) && arr.some(item => item.functionCall != null);
}

function filterFunctionCallInArray(arr) {
    return Array.isArray(arr)
        ? arr.filter(item => item.functionCall != null).map(item => item.functionCall)
        : [];
}
