# 1.0.0 (2022-07-19)


### Bug Fixes

* Add missing default options ([6a6f97b](https://github.com/revolt-io/revolt.io/commit/6a6f97b809315a1c24ce73cd938f973807b91288))
* **Base:** Ignore any object checking ([b8b0681](https://github.com/revolt-io/revolt.io/commit/b8b06812099528aa8fe20225af8450da3eea9816))
* **BaseManager:** fix error when resolving IDs ([0f58756](https://github.com/revolt-io/revolt.io/commit/0f58756ac953add12d439877a00a59413b3f1d1d))
* **BaseManager:** fix error when resolving IDs ([3f838f0](https://github.com/revolt-io/revolt.io/commit/3f838f04ae660d9eb7ec3fb137e5dbe6e10da129))
* change node types version ([56057fe](https://github.com/revolt-io/revolt.io/commit/56057fe89d965300a4b35e9c48cf46f24c1e5395))
* Expose bitfields flags ([2520cd4](https://github.com/revolt-io/revolt.io/commit/2520cd4a6ba64f09ebc6fc12f7317a297a15f254))
* for..in not for..of ([4d2d81e](https://github.com/revolt-io/revolt.io/commit/4d2d81e42b99f183b569632664cd5f7bcd41c7bc))
* Ignore checking collections ([8c39a8f](https://github.com/revolt-io/revolt.io/commit/8c39a8ffa68dabec3aa2e0e53ff94d48163b6127))
* Importing issue ([8019537](https://github.com/revolt-io/revolt.io/commit/80195377ed1b2a5f417eb3b1241775f9eb4e25c8))
* Increase deafult heartbeat to 30s ([c6553c1](https://github.com/revolt-io/revolt.io/commit/c6553c14c8d95803e68c8cd8dd5a41e1d842badd))
* Mark 'revolt-api' lib as a dev dependency ([d55e90f](https://github.com/revolt-io/revolt.io/commit/d55e90f11b600edf34163a6fdd6b9c061965affb))
* **Message:** #url ([4449846](https://github.com/revolt-io/revolt.io/commit/4449846cc9cb6441ca3b81f5f6ab501fe5ae142c))
* **NotesChannel:** Make #user non-nullable ([c32cbf3](https://github.com/revolt-io/revolt.io/commit/c32cbf3b4f86cdff5e4fa0668db7fecb10c4553a))
* Patch lastMessageId for text-channels ([3ba5338](https://github.com/revolt-io/revolt.io/commit/3ba5338816c7d67d99260604018db66a2dbc9342))
* remove console.log ([79a392d](https://github.com/revolt-io/revolt.io/commit/79a392d6354503c8d8e8b26496d596c4c749a899))
* Remove Installation section for deno ([952be98](https://github.com/revolt-io/revolt.io/commit/952be98853b3d8e1e114baadd9d36021b04b0e77))
* Remove useless generic type ([8c37fdc](https://github.com/revolt-io/revolt.io/commit/8c37fdcd422e241c1da3faff6e73fb1913adb68c))
* **ServerChannel:** make #server depends on cache ([99a883d](https://github.com/revolt-io/revolt.io/commit/99a883d1995386e605dc6f0326672a645ef88d6f))
* Update objects correctly ([e775520](https://github.com/revolt-io/revolt.io/commit/e7755209c83d994a564a229339141edd863831bc))
* Use deepMerge helper from deno std ([16d65cf](https://github.com/revolt-io/revolt.io/commit/16d65cf0aceb6eb254177be5af5b36db8ee4b0eb))
* **VoiceChannel:** Add #_patch method ([d775111](https://github.com/revolt-io/revolt.io/commit/d775111afb4037d802566e2ab4e4b025a32a1c56))
* **WebSocket:** Bug ([c15866c](https://github.com/revolt-io/revolt.io/commit/c15866c62b1a1fd091d46eabe4ff5712d002a5e1))


### Features

* Add Attachment class ([1a92451](https://github.com/revolt-io/revolt.io/commit/1a92451e0b9889eb70bd734a07ab1867a86cd5af))
* Add embeds to message options ([c59aa73](https://github.com/revolt-io/revolt.io/commit/c59aa738449678907f2b60bc53c17b70983fbe61))
* Add import map ([3ae247c](https://github.com/revolt-io/revolt.io/commit/3ae247c1e473ed80421ca09fe6be28bd70fd9473))
* Add Invite class ([9c1d6f4](https://github.com/revolt-io/revolt.io/commit/9c1d6f43de8e8833e516f2bf8588f9516c10c29f))
* Add MessageEmbed structure ([1e2695a](https://github.com/revolt-io/revolt.io/commit/1e2695afd74f578448d60c0086e0fa5518fe71ff))
* Add Presence class ([d6884e1](https://github.com/revolt-io/revolt.io/commit/d6884e13e2495902c24aec6c2784c24a4b5143fa))
* Add test command ([36b61c2](https://github.com/revolt-io/revolt.io/commit/36b61c2311e2ceed919193514baae3a72f4c241a))
* API 0.5.3 support ([d24241c](https://github.com/revolt-io/revolt.io/commit/d24241cd692eed1753e12f9a2b9a388ffd193ca4))
* **Client:** Add fetchMembers & reconnect option ([be9b8c3](https://github.com/revolt-io/revolt.io/commit/be9b8c358267290049c62ab0663a3967ae832bb6))
* Emit messageDeleteBulk ([ced9f4d](https://github.com/revolt-io/revolt.io/commit/ced9f4d1165ab5b6607260b25926dad64c4ced07))
* Emit role updates ([3fd7353](https://github.com/revolt-io/revolt.io/commit/3fd735385280313964aa9f6ac3458b72843f2849))
* Emit server creates ([c6dae88](https://github.com/revolt-io/revolt.io/commit/c6dae88e66a400f9b113e376b56ccb6c7374fa59))
* **GroupChannel:** Add #nsfw ([b9a61a3](https://github.com/revolt-io/revolt.io/commit/b9a61a34ea4e4cd7c84d63a975508823e04e55d0))
* **Message:** Add #attachments for message ([b6d7198](https://github.com/revolt-io/revolt.io/commit/b6d71988ce18f96046a3b9f38c5f2927515bbb20))
* **MessageManager:** #fetch accept MessageResolvable ([d258362](https://github.com/revolt-io/revolt.io/commit/d258362f333384dbce8b56bfb7e1e2d17ba9156f))
* Move on to deno as primary runtime ([1684c3e](https://github.com/revolt-io/revolt.io/commit/1684c3e32f63eb107c2884f11794b112a90a903e))
* **Role:** Add #hoist ([8eece55](https://github.com/revolt-io/revolt.io/commit/8eece55711121793c60dd40e619d0573e07e2264))
* **Role:** Add #overwrite field ([487406e](https://github.com/revolt-io/revolt.io/commit/487406ee2c3b08c8b757a56c435d67784b038f1b))
* **Role:** Add #rank field ([29ce301](https://github.com/revolt-io/revolt.io/commit/29ce301186718beeed0b5431ca47e0c32bf45988))
* **Server:** Add #analytics ([92e421d](https://github.com/revolt-io/revolt.io/commit/92e421d4fc4b3fbc2490deb48d88b87e5f493b94))
* **Server:** Add #discoverable ([7e9f12a](https://github.com/revolt-io/revolt.io/commit/7e9f12ad0a9a3e21217a1ef6a35378def9633db6))
* **Server:** Add #nsfw ([12a1a12](https://github.com/revolt-io/revolt.io/commit/12a1a1288fd5b1a397888b58420bc50850a0eeca))
* **ServerChannel:** Add channel overwrites ([58359cd](https://github.com/revolt-io/revolt.io/commit/58359cd76b777193dfb18b4f8d6f5d5e0b463950))
* **Server:** Improve it ([f1edabe](https://github.com/revolt-io/revolt.io/commit/f1edabe8573ca657ccac68e681441b8b360485a2))
* **TextBasedChannel:** Add #bulkDelete ([92b9637](https://github.com/revolt-io/revolt.io/commit/92b96377ff22f58fa2ffff4260877a9b65276976))
* **TextChannel:** Add #nsfw ([566d0d7](https://github.com/revolt-io/revolt.io/commit/566d0d76b52465f52a00fffd77c829f2934b5feb))
* Use the new classess ([92e2041](https://github.com/revolt-io/revolt.io/commit/92e2041ed936aa288af05dc93ef5c689f76e95ee))
* **User:** Add #bot property ([ee1489a](https://github.com/revolt-io/revolt.io/commit/ee1489a05c5719f356b587e9b0af9b131f5b0df3))

# [1.1.0](https://github.com/revolt-io/revolt.io/compare/v1.0.11...v1.1.0) (2022-06-02)


### Bug Fixes

* Add missing default options ([ea96687](https://github.com/revolt-io/revolt.io/commit/ea9668770c786dcea0e0e6a84e82c7964bc40e6f))
* Remove useless generic type ([e3cc47c](https://github.com/revolt-io/revolt.io/commit/e3cc47cbed5388f642d2bf3cffb19d574f0c1815))
* Use deepMerge helper from deno std ([b6bc6d4](https://github.com/revolt-io/revolt.io/commit/b6bc6d430270007616533efc56867c31f51a80b2))


### Features

* Add embeds to message options ([342ba50](https://github.com/revolt-io/revolt.io/commit/342ba5026ad4566e98e115ebdacd83ab54f231a6))
* Add MessageEmbed structure ([9111d68](https://github.com/revolt-io/revolt.io/commit/9111d68b6b3a3c5e5be0310d8a57f0f0dc192c3b))
* **Client:** Add fetchMembers & reconnect option ([47e2e44](https://github.com/revolt-io/revolt.io/commit/47e2e445754c0dab91fdec1a05caef2e782a4ea0))
* Emit server creates ([0601b85](https://github.com/revolt-io/revolt.io/commit/0601b85bf3eed39c3b22b5ea81c39625c560884b))

## [1.0.11](https://github.com/revolt-io/revolt.io/compare/v1.0.10...v1.0.11) (2022-05-31)


### Bug Fixes

* change node types version ([a2c076a](https://github.com/revolt-io/revolt.io/commit/a2c076a3d371bb5786aa9af2e2bb91fac9d2f84a))

## [1.0.10](https://github.com/revolt-io/revolt.io/compare/v1.0.9...v1.0.10) (2022-05-31)


### Bug Fixes

* remove console.log ([5ec50b8](https://github.com/revolt-io/revolt.io/commit/5ec50b8c2e10c22c0939acc4f168b72e8118d21d))
