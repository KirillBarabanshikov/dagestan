document.addEventListener("DOMContentLoaded", () => {
  const BASE64_IMG =
    "data:image/png;base64,     iVBORw0KGgoAAAANSUhEUgAAAGEAAAA0CAYAAACaRVbnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASgSURBVHgB7ZzPThNBHMd/M93qwZisN8XEzCNgBONJW30A4QmEJ6AcjSndAsYj+ASFJ0Bv3ig3IhDqE7gnzo3RxMTdjjOzLdCd2f/NdjaZT0Igsw3Q/e58Z37fmSmCGUCWPy6C7y8CBhuA2mAIgYZAkQsYu+7Zh4F0FQogbj4d7bEb3wBDStAALGvVPX3vTlpqkBPyfPcdE+Ab/xEMWXgIo1HLXngNw6vjE96QqyeQFw4BD/8EQ0FQ0z1v9zHkwcfHYCgOoj3xDTJClnY6bAxwQs1D9tUFq/4FDDL+iE1W2MQFoAM0bN+omUmESBtCsO6ebR2AIRb2ADfYAxx2kc1sdqSyIYQPjAAp8fyB3Ejt1CKQ5Z0NqSshcKFW64IhFe7AGaraU4kgbIhK4wCne3u+a8iHlepVPmaDMYQqYdR3z9oHYChMYk8gy9trzIbWpAuWtQ6GmRArgrAhPq2SoMaGZki8HXEbUgzG7lnHgRIRUzsKtnvRLlSHkIZjwy+8AnfqfZ0eosieEGlDtXoTSmRcHB6z6vKILO/2ICeiV//Bl+wd98D7dynCR01QiiCeGA1sSKrO6WgtjxBCAF7j3PRqG6h/rIsQ6p7wO8KGzsu1IcaK1JJRCIUAE/jaxwZogCTC+OloSa+kaA6zIXqobk4nRIwAAYh+BQ1Q9AT/SGqi9DOPXKFk3POtfW6ByosJQiQLwPKu720tAscpEYQHq6KJ+p19mBOBBWYTIpUAGuVd1yIENYGe0UQWIaomAOd6edN+9PoSwtGESEjbWgR0w6t+315osOgdNeSrdNF+/IbYT17+0F0Ae6HphJpORE+ItCHNEtKkHiHWOirUAyZgnW1IRawQUWi+6ITHCek0mi/UZBKiAqt+mHVfuSCqwEKNEIJNnWNfVJFlVy6CvNrjeQQ0R9goRm/jX4VfQQXArGqUq1JEe2TR0XY7Y+I0dELOrKlsMHh0X8yEbsPfXF0xVmhAagEmVEAILBafVbkQhVawRUMfkgVA6hhCcyFEnSByIdUgp5EtpaqEz9urebOmeXKTHfmsVlDZkoVaMGeyRBF5sqZ5cy1CpC0B6sxz8SNPFlQ1IaZS1CCuVviqOINQPkXCuCoJIa8neD7vDaHagTbI0nb5tuTVekWyoEQhlroOaIAkwnirnuof75AXnwjoQIZKOF4I0GLSoVxjDla0UD/UbLNKutwujPAmhHtljihCKQRCA7ivDC5LJ3rzlzV/WxKH7FCtOZ61DYtkQdNCsAfsnt90++oNumWD4i6Ob3h4UB6CVX9adszNt+HM4qbN6vfk/vtL23S6hXZjt0HG2FLps6VZ3Thdnv7bJG+ND2wpBF0hz3ZWwDATEkVwTx1XObvAdE/npLVKpDokIga1CiWtVSP9mbWKJK1VJLUIVUhadScqg8t4epMaWyqEL29AxniAICMRZ3GDCpSOtNhgqyd8vVvxQSze6EFmETjkWZctiSIttpVXGr7R+qLTyvnZFgpbMmSD379xdpVLBJG01kZN8dk9hhywFKJWv86uctnRbYKzbdyaqDZnwPSF3XxED8MhZGERJohzbn/vmqlqBHGB539so3FWVGYqQQAAAABJRU5ErkJggg==";

  let timerId;
  const BODY = document.querySelector("body");
  const PIN = 1234;
  const TIMER = 2000;
  const HIDE_MODAL = 30000;
  const EXIT_URL = "http://localhost:1702/";
  const BASE_BTN_CONFIG = {
    styles: {
      width: "100%",
      height: "70px",
      border: "none",
      padding: "0px",
      margin: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "20px",
      fontSize: "20px",
      color: "white",
      fontWeight: "600",
      fontFamily: "sans-serif",
    },
  };
  const EXIT_BTN_CONFIG = {
    styles: {
      width: "100px",
      height: "100px",
      position: "fixed",
      top: "0px",
      left: "0px",
      border: "none",
      background: "transparent",
      padding: "0px",
      margin: "0px",
      zIndex: "9999",
    },
    listeners: [
      {
        listener: "mousedown",
        callback: buttonPressed,
      },
      {
        listener: "touchstart",
        callback: buttonPressed,
      },
      {
        listener: "mouseup",
        callback: buttonReleased,
      },
      {
        listener: "touchend",
        callback: buttonReleased,
      },
    ],
  };
  const CONFIRM_BTN_CONFIG = {
    styles: {
      ...BASE_BTN_CONFIG.styles,
      background: "#41AE59",
    },
    text: "Подтвердить",
    listeners: [
      {
        listener: "click",
        callback: () => exitTab(EXIT_URL),
      },
      {
        listener: "touch",
        callback: () => exitTab(EXIT_URL),
      },
    ],
  };
  const CANCEL_BTN_CONFIG = {
    styles: {
      ...BASE_BTN_CONFIG.styles,
      background: "#00ABEB",
    },
    text: "Назад",
    listeners: [
      {
        listener: "click",
        callback: hideModal,
      },
      {
        listener: "touch",
        callback: hideModal,
      },
    ],
  };
  const BASE_NUBMER_CONFIG = {
    styles: {
      width: "80px",
      height: "80px",
      border: "none",
      padding: "0px",
      margin: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "20px",
      fontSize: "20px",
      color: "#203482",
      fontFamily: "sans-serif",
      background: "#00ABEB0D",
    },
    listeners: [
      {
        listener: "click",
        callback: onNumberClick,
      },
      {
        listener: "touch",
        callback: onNumberClick,
      },
    ],
  };
  const BASE_DELETE_CONFIG = {
    styles: {
      ...BASE_NUBMER_CONFIG.styles,
      width: "160px",
      background: `#00ABEB0D url('${BASE64_IMG}') center / 40px no-repeat`,
      flexGrow: "1",
    },
    img: BASE64_IMG,
    listeners: [
      {
        listener: "click",
        callback: onDeleteClick,
      },
      {
        listener: "touch",
        callback: onDeleteClick,
      },
    ],
  };
  const MODAL_CONFIG = {
    styles: {
      width: "370px",
      display: "flex",
      gap: "20px",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      position: "absolute",
      top: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "none",
    },
  };
  const MODAL_CHILDS_CONFIG = {
    global: {
      styles: {
        width: "100%",
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        padding: "32px",
        borderRadius: "40px",
        background: "#f3f6f4",
        boxSizing: "border-box",
      },
    },
    header() {
      return { styles: { ...this.global.styles, flexDirection: "column" } };
    },
    footer() {
      return {
        styles: {
          ...this.global.styles,
          flexWrap: "wrap",
          padding: "32px 45px",
        },
      };
    },
  };
  const HEADER_MODAL_TITLE_CONFIG = {
    styles: {
      textAlign: "center",
      fontSize: "24px",
      fontFamily: "sans-serif",
    },
  };
  const HEADER_MODAL_INPUT_CONFIG = {
    styles: {
      textAlign: "center",
      fontSize: "30px",
      fontFamily: "sans-serif",
      border: "1px solid #00ABEB",
      borderRadius: "20px",
      height: "70px",
      pointerEvents: "none",
    },
  };

  function showModal() {
    const modal = document.querySelector("#modal");
    modal.style.display = "flex";
  }

  function hideModal() {
    const modal = document.querySelector("#modal");
    modal.style.display = "none";
  }

  function timeout() {
    setTimeout(() => {
      hideModal();
    }, HIDE_MODAL);
  }

  function exitTab(url) {
    const input = document.querySelector("#headerModalInput");
    if (input.value != PIN) {
      input.style.borderColor = "red";
      return;
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function buttonPressed() {
    timerId = setTimeout(showModal, TIMER);

    timeout();
  }

  function buttonReleased() {
    clearTimeout(timerId);
  }

  function getBody() {
    return document.querySelector("body");
  }

  function createBtn(config) {
    const btn = document.createElement("button");
    Object.assign(btn.style, config.styles);
    if (config.text) {
      btn.innerHTML = config.text;
    }
    if (config.listeners) {
      config.listeners.forEach((event) => {
        btn.addEventListener(event.listener, event.callback);
      });
    }
    return btn;
  }

  function createNumbers() {
    const BTNS = [];
    for (let index = 0; index <= 9; index++) {
      const btn = createBtn(BASE_NUBMER_CONFIG);
      btn.innerHTML = index;
      BTNS.push(btn);
    }
    BTNS.push(BTNS.shift());
    return BTNS;
    // BTNS.forEach((btn) => {
    //   body.appendChild(btn);
    // });
  }

  function onNumberClick() {
    const input = document.querySelector("#headerModalInput");
    input.value += this.innerHTML;
  }

  function onDeleteClick() {
    const input = document.querySelector("#headerModalInput");
    input.value = input.value.substring(0, input.value.length - 1);
  }

  function createModal() {
    const modal = document.createElement("div");
    const headerModal = document.createElement("div");
    const footerModal = document.createElement("div");
    const headerModalTitle = document.createElement("div");
    const headerModalInput = document.createElement("input");
    headerModalInput.setAttribute("id", "headerModalInput");
    headerModalTitle.innerHTML = "Введите пин-код";
    Object.assign(modal.style, MODAL_CONFIG.styles);
    Object.assign(headerModal.style, MODAL_CHILDS_CONFIG.header().styles);
    Object.assign(footerModal.style, MODAL_CHILDS_CONFIG.footer().styles);
    Object.assign(headerModalTitle.style, HEADER_MODAL_TITLE_CONFIG.styles);
    Object.assign(headerModalInput.style, HEADER_MODAL_INPUT_CONFIG.styles);
    headerModal.appendChild(headerModalTitle);
    headerModal.appendChild(headerModalInput);
    modal.appendChild(headerModal);
    modal.appendChild(footerModal);
    return { modal, headerModal, footerModal };
  }

  const exitBtn = createBtn(EXIT_BTN_CONFIG);
  const confirmBtn = createBtn(CONFIRM_BTN_CONFIG);
  const cancelBtn = createBtn(CANCEL_BTN_CONFIG);
  const deleteBtn = createBtn(BASE_DELETE_CONFIG);
  const numbersBtns = createNumbers();
  const { modal, headerModal, footerModal } = createModal();
  numbersBtns.forEach((btn) => {
    footerModal.appendChild(btn);
  });
  modal.setAttribute("id", "modal");
  footerModal.appendChild(deleteBtn);
  headerModal.appendChild(confirmBtn);
  headerModal.appendChild(cancelBtn);
  BODY.appendChild(modal);

  BODY.appendChild(exitBtn);
});
