// features/detectContactRequest.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// メッセージが連絡先を要求しているかを判定
export const detectContactRequest = async (message: string): Promise<boolean> => {
  try {
    const prompt = `以下のメッセージが「連絡先の交換や要求」を意図しているかどうかを判定してください。
回答は "true" または "false" のみを返してください。メッセージ:${message}`;
    
    // GPT-4またはGPT-3.5-turboを使用
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // または "4"使えない
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0,
    });

    // レスポンスの取得と処理
    const result = response.choices?.[0]?.message?.content?.trim();
    if (result === undefined) {
      console.error('No response content available');
      return false;
    }
    console.log(result);
    // 結果が "true" なら連絡先要求とみなす
    return result === 'true'; 
  } catch (error) {
    console.error('Error detecting contact request:', error);
    return false; // エラー時は問題なしとみなす
  }
};
