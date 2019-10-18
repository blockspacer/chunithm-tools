import * as Users from "../../src/controllers/users";

describe("ユーザーデータの取り扱い", () => {
    test("ユーザーデータの追加", () => {
        return expect(Promise.all([
                Users.create("alice", "password1", "player1"),
                Users.create("bob",   "password2", "player2"),
                Users.create("chris", "password3", "player3")
            ]))
            .resolves
            .not.toThrowError();
    });

    test("ユーザーの存在の確認", () => {
        return expect(Promise.all([
                Users.exist("alice"),
                Users.exist("bob"),
                Users.exist("chris"),
                Users.exist("daniel")
            ]))
            .resolves
            .toMatchObject([
                true,
                true,
                true,
                false
            ]);
    });

    test("ユーザーIDからプレイヤーIDを取得", () => {
        return expect(Promise.all([
                Users.getPlayerId("alice"),
                Users.getPlayerId("bob"),
                Users.getPlayerId("chris")
            ]))
            .resolves
            .toMatchObject([
                "player1",
                "player2",
                "player3"
            ]);
    });

    test("サインインのテスト", () => {
        return expect(Users.signIn("alice", "password1"))
            .resolves
            .not.toThrowError();
    });

    test("サインインのテスト(失敗)", () => {
        return expect(Users.signIn("bob", "password1"))
            .rejects
            .toThrowError();
    });
});
