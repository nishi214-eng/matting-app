import React, { useState, useEffect } from "react";
import { db } from "../infra/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref, getStorage, getDownloadURL} from "firebase/storage";
import { Link } from "react-router-dom";

//プロフィールオブジェクトの型定義。プロフィールの項目はこちらから
interface Profile {
  id : string | null | undefined;
  nickName: string;
  age: number;
  userImage: string | null;
  origin: string;
  hobby: string;
};

const ProfileDisplay: React.FC = () => {
    //読み込みを監視
    const [profiles, setProfiles] = useState<Profile[]>([]);

    //DBからもらってきてデータを格納し、画面をレンダリング
    //Strageから写真をもらってくるけど方法が未定なので決まったら書く。
    useEffect(() => {
        const fetchProfiles = async () => {
          const profilesCollection = collection(db, 'profiles');
          const profileSnapshot = await getDocs(profilesCollection);
          const profileList = profileSnapshot.docs.map(doc => doc.data() as Profile);
          setProfiles(profileList);
        };
        fetchProfiles();
      }, []);

    //マッピングして表示
    //一気に書き上げるため、ニックネームだけ配置。写真の問題を解決したら書く。
    //プロフィールっぽくするためにMUIでよさげなやつを選ぶかCSSを考える。
    return(
      <div>
          <div>
          <h1>自分のプロフィール(仮)</h1>
          <ul>
          {profiles.map((profile, index) => (
            <li key={index}>
              <p>{profile.nickName}</p>
            </li>
          ))}
          </ul>
        </div>
        <div className="linkItem">
          <Link to={"/ProfileForm"} >
              プロフィール更新
          </Link>
        </div>
      </div>
        
    );
};


export default ProfileDisplay;