import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const functionDeclarations = [
    {
        name: "getAllBlogs",
        description:
            "Lấy toàn bộ thông tin các bài blog chia sẻ thông tin y tế học đường. Sử dụng khi người dùng hỏi về thông tin y tế, tin tức, bài viết chia sẻ",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "getClassByStudentID",
        description:
            "Lấy thông tin của lớp mà học sinh đang học, bao gồm tên lớp, tên khối, tổng số lượng học sinh. Sử dụng khi người dùng hỏi về lớp học, thông tin lớp, bạn bè cùng lớp",
        parameters: {
            type: "object",
            properties: {
                student_id: {
                    type: "string",
                    description: "ID của học sinh hoặc con của phụ huynh",
                },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getHealthRecordOfStudent",
        description:
            "Lấy toàn bộ thông tin sức khỏe của học sinh trong các đợt khám định kỳ. Sử dụng khi người dùng hỏi về kết quả khám sức khỏe, tình trạng sức khỏe, chiều cao cân nặng",
        parameters: {
            type: "object",
            properties: {
                student_id: {
                    type: "string",
                    description: "ID của học sinh hoặc con của phụ huynh",
                },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getAllCheckupCampaignInfo",
        description:
            "Lấy toàn bộ thông tin về các đợt khám định kỳ cùng với danh sách các bệnh khám chuyên khoa. Sử dụng khi người dùng hỏi về lịch khám, chiến dịch khám sức khỏe, đăng ký khám",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "getAllSpecialistExamsInfo",
        description:
            "Lấy toàn bộ thông tin về các chuyên khoa của nhà trường hiện có để khám. Sử dụng khi người dùng hỏi về chuyên khoa, loại khám chuyên khoa, bác sĩ chuyên khoa",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "getFullHealthAndSpecialRecordsOfAStudent",
        description:
            "Lấy toàn bộ thông tin về các chiến dịch khám chuyên khoa, khám sức khỏe tổng quát mà học sinh đã tham gia. Sử dụng khi người dùng hỏi về lịch sử khám bệnh, tất cả hồ sơ y tế",
        parameters: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "ID của học sinh hoặc con của phụ huynh",
                },
            },
            required: ["id"],
        },
    },
    {
        name: "getStudentProfile",
        description:
            "Lấy thông tin chi tiết của học sinh bao gồm thông tin cá nhân và thông tin phụ huynh bao gồm cả bố và mẹ. Sử dụng khi người dùng hỏi về thông tin cá nhân, thông tin gia đình, thông tin liên lạc",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getParentProfile",
        description:
            "Lấy thông tin chi tiết của phụ huynh bao gồm thông tin cá nhân và danh sách con. Sử dụng khi người dùng hỏi về thông tin phụ huynh, danh sách con, thông tin gia đình",
        parameters: {
            type: "object",
            properties: {
                parent_id: { type: "string", description: "ID của phụ huynh" },
            },
            required: ["parent_id"],
        },
    },
    {
        name: "getAllVaccinationCampaigns",
        description:
            "Lấy toàn bộ thông tin về các chiến dịch tiêm chủng. Sử dụng khi người dùng hỏi về lịch tiêm chủng, chiến dịch tiêm, đăng ký tiêm chủng",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "getVaccinationRecordsOfStudent",
        description:
            "Lấy lịch sử tiêm chủng của học sinh. Sử dụng khi người dùng hỏi về mũi tiêm đã tiêm, lịch sử tiêm chủng, sổ tiêm chủng",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getDiseaseRecordsOfStudent",
        description:
            "Lấy thông tin về các bệnh mãn tính và truyền nhiễm của học sinh. Sử dụng khi người dùng hỏi về bệnh tật, tiền sử bệnh, bệnh mãn tính, bệnh truyền nhiễm",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getSendDrugRequestsOfStudent",
        description:
            "Lấy danh sách các yêu cầu gửi thuốc của học sinh. Sử dụng khi người dùng hỏi về đơn thuốc, gửi thuốc, nhận thuốc, tình trạng đơn thuốc",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getDailyHealthRecordsOfStudent",
        description:
            "Lấy các sự kiện y tế hàng ngày của học sinh. Sử dụng khi người dùng hỏi về sự cố y tế, tai nạn, bệnh đột xuất, ghi nhận sức khỏe hàng ngày",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getParentDashboardStats",
        description:
            "Lấy thống kê tổng quan cho phụ huynh về tình hình sức khỏe của con. Sử dụng khi người dùng hỏi về tổng quan sức khỏe, thống kê, báo cáo sức khỏe",
        parameters: {
            type: "object",
            properties: {
                student_id: { type: "string", description: "ID của học sinh" },
            },
            required: ["student_id"],
        },
    },
    {
        name: "getVaccinationCampaignDetail",
        description:
            "Lấy thông tin chi tiết của một chiến dịch tiêm chủng cụ thể. Sử dụng khi người dùng hỏi về chi tiết chiến dịch tiêm, thông tin cụ thể về một đợt tiêm",
        parameters: {
            type: "object",
            properties: {
                campaign_id: {
                    type: "string",
                    description: "ID của chiến dịch tiêm chủng",
                },
            },
            required: ["campaign_id"],
        },
    },
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
    getVaccinationCampaignDetail: "/vaccination-campaign/:campaign_id",
    getVaccinationRecordMergeByDiseases:
        "/student/:student_id/vnvc/completed-doses",
};

const prompt = (current_user_role) => {
    const current_user =
        current_user_role === "parent"
            ? "phụ huynh"
            : current_user_role === "admin"
                ? "quản trị viên"
                : current_user_role === "nurse"
                    ? "y tá"
                    : "học sinh";
    const xung_ho =
        current_user_role === "parent"
            ? "phụ huynh hoặc anh chị"
            : current_user_role === "admin"
                ? "quản trị viên"
                : current_user_role === "nurse"
                    ? "y tá"
                    : "bạn";
    return {
        role: "user",
        parts: [
            {
                text: `
        Bạn là trợ lý AI chuyên nghiệp của hệ thống SchoolMedix - nền tảng quản lý y tế học đường hàng đầu. Chúng tôi rất vinh dự được hỗ trợ quý ${current_user} với thái độ lịch sự, kiên nhẫn và thấu hiểu, đặc biệt chú trọng đến tính nhạy cảm của thông tin y tế học sinh.

        Rất mong quý ${current_user} yên tâm rằng thông tin của bạn luôn được bảo mật tuyệt đối. Người bạn đang trò chuyện là ${current_user}, vì thế xin hãy điều chỉnh cách giao tiếp phù hợp nhé.

        NGUYÊN TẮC GIAO TIẾP:
        - Luôn chào hỏi một cách trang trọng và xưng hô lịch sự. Với phụ huynh, xin xưng là "tôi" và gọi "quý phụ huynh"; với học sinh, xin xưng là "mình" và gọi "bạn"; với quản trị viên và y tá, xin xưng là "tôi" và gọi "quý ${current_user}".
        - Trả lời rõ ràng, dễ hiểu, tránh thuật ngữ kỹ thuật phức tạp, ngắn gọn và tinh tế.
        - Kiên nhẫn hướng dẫn từng bước khi cần thiết, với sự chu đáo và tận tâm.
        - Luôn đảm bảo tính bảo mật thông tin y tế, chỉ cung cấp thông tin phù hợp với vai trò của quý ${current_user}.
        - Sử dụng tiếng Việt để giao tiếp một cách trang nhã.
        - Những câu hỏi ngoài nghiệp vụ, xin vui lòng không trả lời để giữ trọng tâm.
        - Tuyệt đối không sử dụng biểu tượng cảm xúc trong câu trả lời.
        - Tránh sử dụng kính ngữ quá mức, nhưng luôn giữ sự tôn trọng.
        - Trả lời tập trung vào câu hỏi, tránh lan man hoặc thừa thãi.
        - Không phản hồi kiểu "Tôi hiểu bạn/anh/chị/quý ${current_user} muốn gì", hãy tập trung vào nội dung.
        - Tránh câu trả lời cụt lủn, thiếu chủ ngữ hoặc vị ngữ; luôn đảm bảo câu hoàn chỉnh.
        - Tuyệt đối không nhại lại câu hỏi một cách vô nghĩa.
        - Không dùng giọng điệu châm chọc, đùa cợt, kể cả khi người dùng nói đùa.
        - Khi không chắc chắn về câu hỏi, xin vui lòng hỏi lại một cách nhẹ nhàng để xác nhận ý định của quý ${current_user}.
        - Nếu không có thông tin, xin hãy trả lời từ tốn, lịch sự và đề xuất phương án tiếp theo với sự chu đáo.
        - Không cần chào lại nếu đã chào nhau trước đó.

        HƯỚNG DẪN SỬ DỤNG API:
        Những lưu ý khi thiếu thông tin để gọi API:
        - Xin vui lòng hỏi thêm để lấy thông tin cần thiết. Cụ thể:
            + Nếu cần campaign_id, xin hỏi tên chiến dịch cụ thể.
            + Nếu cần student_id, xin hỏi tên học sinh hoặc thông tin liên quan.
            + Nếu cần parent_id, xin hỏi tên phụ huynh hoặc email.
            + Nếu cần class_id, xin hỏi tên lớp cụ thể.
            + Nếu cần grade_id, xin hỏi tên khối cụ thể.
        - LƯU Ý QUAN TRỌNG:
            + Nếu biết chắc API nào phù hợp, xin vui lòng thực hiện gọi API bằng functionCall tương ứng.
            + Tuyệt đối không chỉ nêu tên API mà không thực hiện.
            + Nếu thiếu thông tin, xin hỏi lại một cách nhẹ nhàng.
            + Nếu người dùng yêu cầu "kiểm tra lại" hoặc "tôi không biết", xin vui lòng xử lý lại functionCall với thông tin hiện có.

        VÍ DỤ CÁCH GỌI API:
        - "Tôi muốn xem thông tin lớp của con" → getClassByStudentID
        - "Kết quả khám sức khỏe của con thế nào?" → getHealthRecordOfStudent
        - "Lịch sử tiêm chủng của con ra sao?" → getVaccinationRecordsOfStudent + getAllVaccinationCampaigns + getVaccinationCampaignDetail + getVaccinationRecordMergeByDiseases (với phân tích từ VNVC)
        - "Con tôi có bệnh gì không?" → getDiseaseRecordsOfStudent
        - "Đơn thuốc của con thế nào?" → getSendDrugRequestsOfStudent
        - "Thống kê sức khỏe của con?" → getParentDashboardStats
        - "Chiến dịch tiêm chủng sắp tới?" → getAllVaccinationCampaigns
        - "Lịch khám sức khỏe?" → getAllCheckupCampaignInfo
        - "Con tôi đang bị bệnh gì thế" → getParentDashboardStats + getHealthRecordOfStudent + getDiseaseRecordsOfStudent + getVaccinationRecordsOfStudent
        - "Danh sách chiến dịch tiêm chủng hiện tại" (admin) → getAllVaccinationCampaigns
        - "Cập nhật hồ sơ tiêm cho học sinh" (nurse) → getVaccinationRecordsOfStudent

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
        - Admin tạo Checkup Campaign (có thể chỉnh sửa) status campaign = DRAFTED, tạo campaigncontainspeexam (nếu có)
        - Admin gửi Register cho tất cả Parent có Student học ở trường status campaign = PREPARING, tạo Register cho từng Student status register = PENDING, tạo health_record cho từng register status health_record = WAITING, tạo special_exam_record từ campaigncontainspeexam status = CANNOT_ATTACH
        - Parent nhận Register, Submit Register status register = SUBMITTED, special_exam_record status = WAITING nếu Parent chọn tham gia chuyên khoa
        - Admin đóng Register status campaign = UPCOMING, các Register của những phụ huynh chưa Submit thì status register = CANCELLED và không Submit được nữa
        - Admin sau khi hoàn thành Bước 1 tới đây có thể hủy chiến dịch status campaign, special_exam_record, health_record status = CANCELLED
        - Admin khởi động chiến dịch status campaign = ONGOING, Nurse có thể chỉnh sửa báo cáo (update health record cho student) status healthRecord = DONE, có thể chỉnh sửa special_exam_record nếu status của special_exam_record = WAITING, chỉnh sửa xong special_exam_record status = DONE
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
        - Xin vui lòng giải thích quy trình từng bước một cách chi tiết và dễ hiểu.
        - Đưa ra ví dụ cụ thể để quý ${current_user} dễ hình dung.
        - Hướng dẫn cách tìm kiếm thông tin một cách tận tình.
        - Khi xử lý thông tin nhạy cảm:
        - Xác nhận danh tính người dùng một cách nhẹ nhàng.
        - Chỉ cung cấp thông tin phù hợp với vai trò.
        - Nhắc nhở về tính bảo mật với sự quan tâm chân thành.

        Trước khi trả về phản hồi, xin vui lòng chỉnh sửa để trình bày dưới dạng HTML sạch sẽ:
        - Xử lý toàn bộ nội dung thành các thẻ HTML để dễ dàng hiển thị trên khung chat.
        - Loại bỏ các ký tự dư thừa và sai cấu trúc code HTML.
        - Đảm bảo câu trả lời sạch sẽ, không có chữ thừa.

        KHI KẾT THÚC:
        - Xin hỏi thêm xem quý ${current_user} có cần hỗ trợ gì khác không.
        - Chúc sức khỏe và cảm ơn ${xung_ho} đã sử dụng dịch vụ của chúng tôi.
        `,
            },
        ],
    };
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function getResponseFromAI(req, res) {
    const {
        current_user_role,
        chat_history,
        new_message,
        student_info,
        parent_info,
        token
    } = req.body;
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
            request_content,
        ],
        tools: [{ functionDeclarations }],
        generationConfig: {
            candidateCount: 8,
            temperature,
        },
    });

    const candidates = result.response.candidates;

    let try_number = 1;
    const chosen = candidates.find((c) => {
        console.log("Lần thử thứ: " + try_number++);
        console.log(c.content.parts);
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
        calls.map((call) => {
            console.log(call);
            return callAPIFromAI(call, token).then((data) => JSON.stringify(data));
        })
    );

    const api_response_text = `API_RESPONSE: ĐÂY LÀ KẾT QUẢ TRẢ VỀ TỪ CÁC API. DÙ KẾT QUẢ RA SAO, TÔi SẼ TRẢ LỜI NGƯỜI DÙNG DỰA TRÊN NỘI DUNG NÀY. NẾU BỊ LỖI, HÃY BÁO RÕ LÝ DO. NẾU KHÔNG CÓ DỮ LIỆU, HÃY NÓI RÕ KHÔNG CÓ THÔNG TIN: ${responses.join(
        "\n\n"
    )}`;

    const api_response_content = {
        role: "model",
        parts: [{ text: api_response_text }],
    };

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
                        text: "Hãy phản hồi người dùng bằng tiếng Việt dựa trên kết quả API ở trên. Trình bày bằng HTML sạch sẽ. Nếu lỗi thì giải thích lý do. Nếu không có dữ liệu, hãy thông báo không có dữ liệu. Cuối cùng, hỏi thêm xem họ có cần hỗ trợ gì khác không. Bạn đừng trả lời ngay trong API_RESPONSE nhé, hãy trả lời ngay bên dưới đây nè! ",
                    },
                ],
            },
        ],
        generationConfig: {
            temperature,
        },
    });

    const apiReply = await followup.response;
    return res.json({
        new_contents: [api_response_content, apiReply.candidates[0].content],
    });
}

async function callAPIFromAI(call, token) {
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

        const res = await axios.get(fullURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("❌ callAPIFromAI error:", error.message);
        return "Không thể lấy thông tin từ api";
    }
}


function hasFunctionCallInArray(arr) {
    return Array.isArray(arr) && arr.some((item) => item.functionCall != null);
}

function filterFunctionCallInArray(arr) {
    return Array.isArray(arr)
        ? arr
            .filter((item) => item.functionCall != null)
            .map((item) => item.functionCall)
        : [];
}
