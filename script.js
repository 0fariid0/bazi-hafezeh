class GenNumber extends React.Component {
  componentDidUpdate() {
    let time, digit;
    // increase showing time depend on level
    digit = this.props.level.main + 2;
    time = 100 * Math.min(digit, 5) + 400 * Math.max(digit - 5, 0);

    let number = document.getElementById('number');
    setTimeout(function () {
      number.innerHTML = number.innerHTML.replace(/\w/gi, '&#183;');
    }, time);
  }

  componentDidMount() {
    let number = document.getElementById('number');
    setTimeout(function () {
      number.innerHTML = number.innerHTML.replace(/\w|\W/gi, '&#183;');
    }, 1200);
  }

  render() {
    return (
      <div className="app__gen-number">
        <div className="app__info">
          <p className="app__level">مرحله: {this.props.level.main} - {this.props.level.sub}</p>
          <p className="app__wrong">اشتباه: {this.props.wrong}/3</p>
        </div>
        <p className="app__divider">############################</p>
        <p className="app__number" id="number">{this.props.wrong < 3 ? atob(this.props.question) : '????'}</p>
        <p className="app__divider">############################</p>
      </div>
    );
  }
}

class InputNumber extends React.Component {
  constructor() {
    super();
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleUserInput(e) {
    e.preventDefault();
    let userNumber = btoa(this.userNumber.value);
    this.userNumber.value = "";
    this.props.compareUserInput(userNumber);
  }

  handleReset() {
    this.props.onReset();
  }

  render() {
    let layout;
    if (this.props.wrong < 3) {
      layout = (
        <div className="app__input">
          <form onSubmit={this.handleUserInput}>
            عدد چند بود ؟ :
            <input
              pattern="[0-9]+"
              type="text"
              ref={ref => this.userNumber = ref}
              required
              autoFocus
            />
            <br />
            <br />
          </form>
          <button onClick={this.handleReset}>دوباره</button>
        </div>
      );
    } else {
      layout = (
        <div className="app__end">
          <div className="app__notify">Better luck next time (\u2727\u03C9\u2727)</div>
          <br />
          <br />
          <button onClick={this.handleReset}>Restart</button>
        </div>
      );
    }

    return layout;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.compareUserInput = this.compareUserInput.bind(this);
    this.randomGenerate = this.randomGenerate.bind(this);
    this.resetState = this.resetState.bind(this);
    this.state = {
      question: btoa(this.randomGenerate(2)),
      level: { main: 1, sub: 1 },
      wrong: 0,
      correctAnswers: 0, // اضافه کردن شمارنده برای پاسخ‌های صحیح
      bestScore: 0, // اضافه کردن رکورد
    };
  }

  resetState() {
    this.setState({
      question: btoa(this.randomGenerate(2)),
      level: { main: 1, sub: 1 },
      wrong: 0,
      correctAnswers: 0, // بازنشانی پاسخ‌های صحیح هنگام شروع دوباره بازی
    });
  }

  randomGenerate(digit) {
    let max = Math.pow(10, digit) - 1,
      min = Math.pow(10, digit - 1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  compareUserInput(userNumber) {
    let currQuestion = this.state.question,
      mainLevel = this.state.level.main,
      subLevel = this.state.level.sub,
      wrong = this.state.wrong,
      correctAnswers = this.state.correctAnswers,
      bestScore = this.state.bestScore,
      digit;

    if (userNumber == currQuestion) {
      // کاربر جواب درست داده است
      correctAnswers++;

      // بروزرسانی رکورد اگر تعداد پاسخ‌های صحیح جدید بیشتر از رکورد قبلی است
      if (correctAnswers > bestScore) {
        bestScore = correctAnswers;
      }

      if (subLevel < 3) {
        ++subLevel;
      } else if (subLevel == 3) {
        ++mainLevel;
        subLevel = 1;
      }
    } else {
      ++wrong;
    }

    digit = mainLevel + 2;

    this.setState({
      question: btoa(this.randomGenerate(digit)),
      level: { main: mainLevel, sub: subLevel },
      wrong: wrong,
      correctAnswers: correctAnswers,
      bestScore: bestScore, // ذخیره رکورد جدید
    });
  }

  render() {
    return (
      <div className="main__app">
        <GenNumber
          question={this.state.question}
          level={this.state.level}
          wrong={this.state.wrong}
        />
        <InputNumber
          compareUserInput={this.compareUserInput}
          wrong={this.state.wrong}
          onReset={this.resetState}
        />
        <div className="app__score">
          <p>تعداد پاسخ‌های صحیح: {this.state.correctAnswers}</p>
          <p>رکورد: {this.state.bestScore}</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
