const App = ({ title }: { title: string }) => {
  return (
    <div className="h1">
      {title}
      <style jsx>
        {`
          .h1 {
            height: 45px;
            font-size: 38px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 45px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
