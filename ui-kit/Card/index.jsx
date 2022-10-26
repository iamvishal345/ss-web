import styles from "./styles.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
const Card = ({ item }) => {
  const router = useRouter();
  const handleCardClick = (pageUrl) => {
    if (pageUrl) {
      router.push(pageUrl, undefined);
    }
  };
  return (
    <div onClick={() => handleCardClick(item.pageUrl)} className={styles.card}>
      {item.imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            height={180}
            width={260}
            loading="lazy"
            placeholder="blur"
          />
        </div>
      )}
      <span role="button" tabIndex={0} className={styles.cardHeader}>
        {item.title}
      </span>
      <span className={styles.cardSubheader}>
        {item.discount ? { discount: item.discount } : <>&shy;</>}
      </span>
    </div>
  );
};

export default Card;
