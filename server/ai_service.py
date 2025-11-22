from google import genai
from django.conf import settings

# 初始化客户端
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_weight_trend(weight_logs):
    """
    输入：体重记录数组
    输出：AI 分析结果字符串
    """
    prompt = f"""
你是一名健康趋势分析助手，请根据下列体重数据进行分析：
{weight_logs}

要求：
- 判断趋势（上升/下降/波动）
- 找出明显变化日期
- 给出简单建议（不涉及医学诊断）
- 使用简洁中文
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text


def generate_report_content(weight_logs):
    """
    返回用于 PDF 的周报内容
    """
    prompt = f"""
请根据以下体重记录生成一份正式的【周健康报告】：

体重数据：
{weight_logs}

报告必须包含：
1. 本周体重趋势总结（两段）
2. 本周关键数据（最高/最低/平均体重）
3. 本周生活建议（饮食、运动，不能涉及医学诊断）
4. 保持格式清晰美观，适合作为 PDF 显示
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text
