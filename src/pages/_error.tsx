import { Button } from 'antd';

function Error({ statusCode }: any) {
  return (
    <div className="content">
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>

      <style jsx>
        {`
          .content {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #fff;
            font-size: 20px;

            background-color: #000;
          }
        `}
      </style>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
